import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import * as CoordsActions from '../../store/actions/coords.actions'
import { selectCoordinatesById, selectCoordinatesLoading, selectCoordinatesError } from '../../store/selectors/coords.selector';
import { Coordinates } from '../../store/models/coords.models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-coordinates-detail',
  standalone: false,
  templateUrl: './coords-detail.component.html',
  styleUrls: ['./coords-detail.component.scss']
})
export class CoordinatesDetailComponent implements OnInit, OnDestroy {
  @Input() coordinates$!: Observable<Coordinates | undefined>;
  loading$!: Observable<boolean>;
  error$!: Observable<any>;
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
      this.store.select(selectCoordinatesById(this.id)).pipe(takeUntil(this.destroy$), take(1)).subscribe(v => {
        if (!v) {
          this.store.dispatch(CoordsActions.loadCoordinates({ id: this.id }));
        }
      });
      this.coordinates$ = this.store.select(selectCoordinatesById(this.id));
    });

    this.loading$ = this.store.select(selectCoordinatesLoading);
    this.error$ = this.store.select(selectCoordinatesError);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openEdit(coords: Coordinates) {
    this.dialog.open(CoordinatesDetailComponent, {
      width: '720px',
      data: { mode: 'edit', coords }
    });
  }

  deleteCoordinates(coords: Coordinates) {
    if (!confirm('Удалить транспортное средство?')) return;
    this.store.dispatch(CoordsActions.deleteCoordinates({ id: coords.id }));
    this.router.navigate(['/coordinates']);
  }
}
