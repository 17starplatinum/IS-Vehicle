import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Coordinates } from '../../store/models/coords.models';
import * as CoordinatesActions from '../../store/actions/coords.actions';
import { 
    selectCoordinatesList, 
    selectCoordinatesPage, 
    selectCoordinatesTotal, 
    selectCoordinatesPageSize, 
    selectCoordinatesLoading 
} from '../../store/selectors/coords.selector';

@Component({
    selector: 'app-coords-table',
    standalone: false,
    templateUrl: './coords-table.component.html',
    styleUrls: ['./coords-table.component.scss']
})
export class CoordinatesTableComponent implements OnInit {
    constructor(private store: Store) {
        this.coordinates$ = this.store.select(selectCoordinatesList);
        this.loading$ = this.store.select(selectCoordinatesLoading);
        this.page$ = this.store.select(selectCoordinatesPage);
        this.pageSize$ = this.store.select(selectCoordinatesPageSize);
        this.total$ = this.store.select(selectCoordinatesTotal);
    }

    @Input() coordinates$: Observable<Coordinates[]>;
    @Input() loading$: Observable<boolean>;
    @Input() page$: Observable<number>;
    @Input() pageSize$: Observable<number>;
    @Input() total$: Observable<number>;
    @Output() edit = new EventEmitter<Coordinates>();
    @Output() delete = new EventEmitter<number>();
    @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();
    dataSource = new MatTableDataSource<Coordinates>();
    
    columns = ['id', 'x', 'y'];
    page = 1;
    pageSize = 10;
    total = 0;
    sortBy: string = 'id';
    ascending: boolean = true;

    private destroy$ = new Subject<void>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit() {
        this.store.select(selectCoordinatesList)
            .pipe(takeUntil(this.destroy$))
            .subscribe(list => {
                this.dataSource.data = list || [];
            });
        this.loadCoordinates();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe(ev => {
            this.store.dispatch(CoordinatesActions.loadCoordinatesList({
                page: ev.pageIndex,
                pageSize: ev.pageSize,
                sortBy: this.sort.active,
                ascending: (this.sort.direction || null) as any
            }));
        });

        this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.paginator.pageIndex = 0;
            this.store.dispatch(CoordinatesActions.loadCoordinatesList({
                page: 0,
                pageSize: this.paginator.pageSize,
                sortBy: this.sort.active,
                ascending: (this.sort.direction || null) as any
            }));
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadCoordinates() {
        this.store.dispatch(CoordinatesActions.loadCoordinatesList({
            page: this.page,
            pageSize: this.pageSize,
            sortBy: this.sortBy,
            ascending: this.ascending
        }));
    }

    sortFunction(column: string) {
        if (this.sortBy === column) {
            this.ascending = this.ascending;
        } else {
            this.sortBy = column;
            this.ascending = true;
        }
        this.loadCoordinates();
    }

    prevPage() {
        if (this.page > 0) {
            this.page--;
            this.loadCoordinates();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.total / this.pageSize);
        if (this.page < totalPages - 1) {
            this.page++;
            this.loadCoordinates();
        }
    }

    get totalPages() {
        return Math.ceil(this.total / this.pageSize);
    }
}
