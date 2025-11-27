import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as CoordsActions from '../../store/actions/coords.actions'
import { CreateCoordinatesRequest } from '../../store/models/coords.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-coords-form-dialog',
  standalone: false,
  templateUrl: './coordinates-form-dialog.component.html',
  styleUrls: ['./coordinates-form-dialog.component.scss']
})
export class CoordsFormDialogComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    @Optional() public dialogRef: MatDialogRef<CoordsFormDialogComponent> | null,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any | null
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
        x: [0, [Validators.required]],
        y: [0, [Validators.required]]
    });

    if (this.data?.coordinates) {
      this.form.patchValue({
        x: this.data.coordinates.x,
        y: this.data.coordinates.y
      });
    }
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const c = this.form.value;
    const x = c.x;
    const y = c.y;
    const coordPayload: CreateCoordinatesRequest = { x: Number(x), y: Number(y) };
    this.store.dispatch(CoordsActions.createCoordinates({ coordinates: coordPayload }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
