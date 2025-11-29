import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, Input } from '@angular/core';
import { CoordinatesFacade } from '../../coords.facade';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CoordsFormDialogComponent } from '../../components/forms/coordinates-form-dialog.component';
import { Coordinates } from '../../store/models/coords.models';
import { CoordinatesTableComponent } from '../../components/tables/coords-table.component';
import { SharedMaterialModule } from '../../../../common/shared-material/shared-material.module';

@Component({
  selector: 'app-coordinates-page',
  standalone: true,
  imports: [
    CoordinatesTableComponent,
    SharedMaterialModule
  ],
  templateUrl: './coords-page.component.html',
  styleUrls: ['./coords-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoordinatesPageComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  @Input() coordinates$: Observable<any[]>;
  @Input() loading$: Observable<boolean>;
  @Input() page$: Observable<number>;
  @Input() pageSize$: Observable<number>;
  @Input() total$: Observable<number>;

  constructor(
    private facade: CoordinatesFacade,
    private dialog: MatDialog
  ) {
    this.coordinates$ = this.facade.list$;
    this.loading$ = this.facade.loading$;
    this.page$ = this.facade.page$;
    this.pageSize$ = this.facade.pageSize$;
    this.total$ = this.facade.total$;
  }

  ngOnInit() {
    this.facade.load(0, 10, 'id', true);
  }

  openCreateDialog() {
    const ref = this.dialog.open(CoordsFormDialogComponent, {
      width: '720px',
      data: { mode: 'create' }
    });

    ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
    });
  }
  
  add() {
    this.dialog.open(CoordsFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });
  }

  edit(item: any) {
    this.dialog.open(CoordsFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', coordinates: item }
    });
  }

  delete(id: number) {
    if (confirm(`Удалить координаты #${id}?`)) {
      this.facade.delete(id);
    }
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.facade.load(event.pageIndex, event.pageSize, 'id', true);
  }

  onEdit(coords: Coordinates) {
    this.dialog.open(CoordsFormDialogComponent, {
      width: '720px',
      data: { mode: 'edit', coords }
    });
  }

  onDelete(id: number) {
    if (!confirm('Удалить?')) return;
    this.facade.delete(id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
