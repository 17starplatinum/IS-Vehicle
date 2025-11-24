import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoordinatesFacade } from '../../coords.facade';
import { Observable, Subject } from 'rxjs';
import { Coordinates } from '../../store/models/coords.models';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CoordsFormDialogComponent } from '../../components/forms/coordinates-form-dialog.component';

@Component({
  selector: 'app-coords-detail-page',
  standalone: false,
  templateUrl: './coords-detail-page.component.html',
  styleUrls: ['./coords-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoordinatesDetailPageComponent implements OnInit, OnDestroy {
  coordinates$!: Observable<Coordinates | undefined>;
  loading$!: Observable<boolean>;
  private destroy$ = new Subject<void>();
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facade: CoordinatesFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(pm => {
      const idStr = pm.get('id');
      if (!idStr) return;
      this.id = Number(idStr);
      this.facade.loadOne(this.id);
      this.coordinates$ = this.facade.selected$(this.id);
      this.loading$ = this.facade.loading$;
    });
  }

  openEdit(coords: Coordinates) {
    this.dialog.open(CoordsFormDialogComponent, { width: '720px', data: { mode: 'edit', coords } });
  }

  delete(coords: Coordinates) {
    if (!confirm('Удалить координаты?')) return;
    this.facade.delete(coords.id);
    this.router.navigate(['/coordinates']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
