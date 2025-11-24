import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import * as VehiclesActions from '../../store/actions/vehicles.actions'
import { selectVehicleById, selectVehiclesLoading, selectVehiclesError } from '../../store/selectors/vehicles.selector';
import { Vehicle } from '../../store/models/vehicles.models';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormDialogComponent } from '../forms/vehicle-form-dialog.component';

@Component({
  selector: 'app-vehicle-detail',
  standalone: false,
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss']
})
export class VehicleDetailComponent implements OnInit, OnDestroy {
  @Input() vehicle$!: Observable<Vehicle | undefined>;
  @Input() loading$!: Observable<boolean>;
  @Input() error$!: Observable<any>;
  private destroy$ = new Subject<void>();
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(pm => {
      const idStr = pm.get('id');
      if (!idStr) return;
      this.id = Number(idStr);
      this.store.select(selectVehicleById(this.id)).pipe(takeUntil(this.destroy$), take(1)).subscribe(v => {
        if (!v) {
          this.store.dispatch(VehiclesActions.loadVehicle({ id: this.id }));
        }
      });
      this.vehicle$ = this.store.select(selectVehicleById(this.id));
    });

    this.loading$ = this.store.select(selectVehiclesLoading);
    this.error$ = this.store.select(selectVehiclesError);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openEdit(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(VehicleFormDialogComponent, {
      width: '720px',
      data: { mode: 'edit', vehicle }
    });
  }

  deleteVehicle(vehicle: Vehicle) {
    if (!confirm('Удалить транспортное средство?')) return;
    this.store.dispatch(VehiclesActions.deleteVehicle({ id: vehicle.id }));
    this.router.navigate(['/vehicles']);
  }
}
