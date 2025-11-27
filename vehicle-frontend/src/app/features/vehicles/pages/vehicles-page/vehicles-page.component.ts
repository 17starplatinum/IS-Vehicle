import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { VehiclesFacade } from '../../vehicles.facade';
import { Observable, Subject } from 'rxjs';
import { Vehicle } from '../../store/models/vehicles.models';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormDialogComponent } from '../../components/forms/vehicle-form-dialog.component';
import { takeUntil } from 'rxjs/operators';
import {
  selectSpecialOpsLoading,
  selectSpecialOpsResult,
  selectSpecialOpsError,
  selectSpecialOpsCurrentOp
} from '../../store/selectors/special-ops.selector';
import * as VehicleActions from '../../store/actions/vehicles.actions';
import { Store } from '@ngrx/store';
import { SpecialOpsPanelComponent } from '../../components/special-ops-panel/special-ops-panel.component';
import { VehiclesTableComponent } from "../../components/tables/vehicles-table.component";
import { SharedMaterialModule } from '../../../../common/shared-material/shared-material.module';

@Component({
  selector: 'app-vehicles-page',
  standalone: true,
  imports: [
    SpecialOpsPanelComponent,
    SharedMaterialModule,
    VehiclesTableComponent
],
  templateUrl: './vehicles-page.component.html',
  styleUrls: ['./vehicles-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesPageComponent implements OnInit, OnDestroy {
  vehicles$: Observable<Vehicle[]>;
  loading$: Observable<boolean>;
  page$: Observable<number>;
  pageSize$: Observable<number>;
  total$: Observable<number>;
  
  private destroy$ = new Subject<void>();
  @Input() result$: Observable<any>
  @Input() error$: Observable<any>;
  @Input() currentOp$: Observable<string | null | undefined>;
  @Input() threshold: string | null = null;
  @Input() minPower: number | null = null;
  @Input() maxPower: number | null = null;

  constructor(private facade: VehiclesFacade, private dialog: MatDialog, private store: Store) {
    this.vehicles$ = this.facade.list$;
    this.loading$ = this.facade.loading$;
    this.page$ = this.facade.page$;
    this.pageSize$ = this.facade.pageSize$;
    this.total$ = this.facade.total$;
    this.loading$ = this.store.select(selectSpecialOpsLoading);
    this.result$ = this.store.select(selectSpecialOpsResult);
    this.error$ = this.store.select(selectSpecialOpsError);
    this.currentOp$ = this.store.select(selectSpecialOpsCurrentOp);
  }

  ngOnInit(): void {
    this.facade.loadPage(0, 10, 'id', true);
  }

  openCreateDialog() {
    const ref = this.dialog.open(VehicleFormDialogComponent, {
      width: '1080px',
      maxWidth: '92vw',
      minWidth: '420px',
      panelClass: 'vehicle-form-dialog-panel',
      data: { mode: 'create' }
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(() => {
    });
  }

  runFilterByFuelType() {
    this.store.dispatch(VehicleActions.loadVehicles({page: 1, pageSize: 10, sortBy: 'id', ascending: true, fuelType: this.threshold, min: null, max: null, filter: ""}));
  }

  runFindByPowerRange() {
    this.store.dispatch(VehicleActions.loadVehicles({page: 1, pageSize: 10, sortBy: 'id', ascending: true, fuelType: "", min: null, max: null, filter: ""}));
  }

  onEdit(vehicle: Vehicle) {
    this.dialog.open(VehicleFormDialogComponent, {
      width: '1080px',
      maxWidth: '92vw',
      minWidth: '420px',
      panelClass: 'vehicle-form-dialog-panel',
      data: { mode: 'edit', vehicle }
    });
  }

  onDelete(id: number) {
    if (!confirm('Удалить?')) return;
    this.facade.delete(id);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.facade.loadPage(event.pageIndex, event.pageSize, 'id', true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
