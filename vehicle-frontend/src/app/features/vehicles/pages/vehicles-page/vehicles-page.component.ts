import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { VehiclesFacade } from '../../vehicles.facade';
import { Observable, Subject } from 'rxjs';
import { Vehicle } from '../../store/models/vehicles.models';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormDialogComponent } from '../../components/forms/vehicle-form-dialog.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles-page',
  standalone: false,
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

  constructor(private facade: VehiclesFacade, private dialog: MatDialog) {
    this.vehicles$ = this.facade.list$;
    this.loading$ = this.facade.loading$;
    this.page$ = this.facade.page$;
    this.pageSize$ = this.facade.pageSize$;
    this.total$ = this.facade.total$;
  }

  ngOnInit(): void {
    this.facade.loadPage(0, 10, 'id', true);
  }

  openCreateDialog() {
    const ref = this.dialog.open(VehicleFormDialogComponent, {
      width: '720px',
      data: { mode: 'create' }
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
    });
  }

  onEdit(vehicle: Vehicle) {
    this.dialog.open(VehicleFormDialogComponent, {
      width: '720px',
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
