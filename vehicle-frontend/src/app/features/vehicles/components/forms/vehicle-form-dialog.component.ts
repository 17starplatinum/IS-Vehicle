import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Observable, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';

import * as VehiclesActions from '../../store/actions/vehicles.actions';
import * as CoordActions from '../../../coordinates/store/actions/coords.actions';
import { selectCoordinatesList } from '../../../coordinates/store/selectors/coords.selector';
import { CreateVehicleRequest, CreateCoordinatesRequest } from '../../store/models/vehicles.models';

@Component({
  selector: 'app-vehicle-form-dialog',
  standalone: false,
  templateUrl: './vehicle-form-dialog.component.html',
  styleUrls: ['./vehicle-form-dialog.component.scss']
})
export class VehicleFormDialogComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  coordinates$!: Observable<any[]>; // типизируй по своему Coordinates[]
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    public dialogRef: MatDialogRef<VehicleFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // safe: store уже инжектирован
    this.coordinates$ = this.store.select(selectCoordinatesList);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      enginePower: [null],
      numberOfWheels: [1, [Validators.required]],
      capacity: [1, [Validators.required]],
      distanceTravelled: [0, [Validators.required]],
      fuelConsumption: [0, [Validators.required]],
      fuelType: ['', [Validators.required]],

      coordMode: ['existing'],
      coordinates: this.fb.group({
        id: [null],
        x: [null],
        y: [null]
      })
    });

    if (this.data?.vehicle) {
      this.form.patchValue({
        name: this.data.vehicle.name,
        type: this.data.vehicle.type,
        enginePower: this.data.vehicle.enginePower ?? null,
        numberOfWheels: this.data.vehicle.numberOfWheels,
        capacity: this.data.vehicle.capacity,
        distanceTravelled: this.data.vehicle.distanceTravelled,
        fuelConsumption: this.data.vehicle.fuelConsumption,
        fuelType: this.data.vehicle.fuelType
      });

      if (this.data.vehicle.coordinates?.id != null) {
        this.form.patchValue({ coordMode: 'existing', coordinates: { id: this.data.vehicle.coordinates.id } });
      }
    }

    this.form.get('coordMode')!.valueChanges.subscribe(mode => this.applyCoordValidators(mode));
    this.applyCoordValidators(this.form.get('coordMode')!.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyCoordValidators(mode: 'existing' | 'new') {
    const coordGroup = this.form.get('coordinates') as FormGroup;
    const idControl = coordGroup.get('id')!;
    const xControl = coordGroup.get('x')!;
    const yControl = coordGroup.get('y')!;

    if (mode === 'existing') {
      idControl.setValidators([Validators.required]);
      xControl.clearValidators();
      yControl.clearValidators();
    } else {
      idControl.clearValidators();
      xControl.setValidators([Validators.required]);
      yControl.setValidators([Validators.required]);
    }

    idControl.updateValueAndValidity();
    xControl.updateValueAndValidity();
    yControl.updateValueAndValidity();
  }

  private buildVehiclePayload(v: any, coordId: number): CreateVehicleRequest {
    return {
      name: v.name,
      type: v.type,
      enginePower: v.enginePower ?? null,
      numberOfWheels: v.numberOfWheels,
      capacity: v.capacity,
      distanceTravelled: v.distanceTravelled,
      fuelConsumption: v.fuelConsumption,
      fuelType: v.fuelType,
      coordinates: { id: coordId }
    };
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    if (v.coordMode === 'existing') {
      const id = v.coordinates?.id;
      if (id == null) {
        this.form.get('coordinates.id')?.setErrors({ required: true });
        return;
      }
      const payload = this.buildVehiclePayload(v, id);
      this.dispatchVehicleAction(payload);
      return;
    }

    // new coords
    const x = v.coordinates?.x;
    const y = v.coordinates?.y;
    if (x == null || y == null) {
      if (x == null) this.form.get('coordinates.x')?.setErrors({ required: true });
      if (y == null) this.form.get('coordinates.y')?.setErrors({ required: true });
      return;
    }

    const coordPayload: CreateCoordinatesRequest = { x: Number(x), y: Number(y) };
    this.store.dispatch(CoordActions.createCoordinates({ coordinates: coordPayload }));

    try {
      const action = await firstValueFrom(
        this.actions$.pipe(ofType(CoordActions.createCoordinatesSuccess, CoordActions.createCoordinatesFailure), take(1))
      );

      if (action.type === CoordActions.createCoordinatesSuccess.type) {
        const created = (action as ReturnType<typeof CoordActions.createCoordinatesSuccess>).coordinates;
        const payload = this.buildVehiclePayload(v, created.id);
        this.dispatchVehicleAction(payload);
      } else {
        // handle failure
      }
    } catch (err) {
      // handle error
    }
  }

  private dispatchVehicleAction(payload: CreateVehicleRequest) {
    this.store.dispatch(VehiclesActions.createVehicle({ vehicle: payload }));
    this.dialogRef.close();
  }
}
