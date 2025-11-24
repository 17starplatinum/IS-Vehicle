import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiclesFacade } from '../../vehicles.facade';
import { Observable, Subject } from 'rxjs';
import { Vehicle } from '../../store/models/vehicles.models';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormDialogComponent } from '../../components/forms/vehicle-form-dialog.component';

@Component({
  selector: 'app-vehicle-detail-page',
  standalone: false,
  templateUrl: './vehicles-detail-page.component.html',
  styleUrls: ['./vehicles-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleDetailPageComponent implements OnInit, OnDestroy {
  vehicle$!: Observable<Vehicle | undefined>;
  loading$!: Observable<boolean>;
  private destroy$ = new Subject<void>();
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facade: VehiclesFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(pm => {
      const idStr = pm.get('id');
      if (!idStr) return;
      this.id = Number(idStr);
      this.facade.loadOne(this.id);
      this.vehicle$ = this.facade.selectedVehicle$(this.id);
      this.loading$ = this.facade.loading$;
    });
  }

  openEdit(vehicle: Vehicle) {
    this.dialog.open(VehicleFormDialogComponent, { width: '720px', data: { mode: 'edit', vehicle } });
  }

  delete(vehicle: Vehicle) {
    if (!confirm('Удалить транспорт?')) return;
    this.facade.delete(vehicle.id);
    this.router.navigate(['/vehicles']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
