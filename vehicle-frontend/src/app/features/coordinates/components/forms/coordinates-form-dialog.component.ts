import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as CoordsActions from '../../store/actions/coords.actions'
import { selectCoordinatesList } from '../../store/selectors/coords.selector';
import { Coordinates } from '../../store/models/coords.models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-coords-form-dialog',
  standalone: false,
  templateUrl: './coordinates-form-dialog.component.html',
  styleUrls: ['./coordinates-form-dialog.component.scss']
})
export class CoordsFormDialogComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Coordinates>([]);
  displayedColumns = ['id', 'x', 'y'];
  loading$: Observable<any[]>;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private dialog: MatDialog) {
    this.loading$ = this.store.select(selectCoordinatesList)
  }

  ngOnInit() {
    this.store.select(selectCoordinatesList).pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.dataSource.data = list || [];
    });

    this.store.dispatch(CoordsActions.loadCoordinatesList({page: 1, pageSize: 10, sortBy: 'id', ascending: true}));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openCreate() {
    const ref = this.dialog.open(CoordsFormDialogComponent, { width: '400px', data: { mode: 'create' } });
  }

  openEdit(coord: Coordinates) {
    this.dialog.open(CoordsFormDialogComponent, { width: '400px', data: { mode: 'edit', coord } });
  }

  delete(id: number) {
    if (!confirm('Delete coordinate?')) return;
    this.store.dispatch(CoordsActions.deleteCoordinates({ id }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
