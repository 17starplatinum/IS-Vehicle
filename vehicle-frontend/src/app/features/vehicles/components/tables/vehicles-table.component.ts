import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Vehicle } from '../../store/models/vehicles.models';
import { VehicleFormDialogComponent } from '../forms/vehicle-form-dialog.component';
import * as VehiclesActions from '../../store/actions/vehicles.actions';
import { 
    selectVehiclesList, 
    selectVehiclesPage, 
    selectVehiclesTotal, 
    selectVehiclesPageSize, 
    selectVehiclesLoading 
} from '../../store/selectors/vehicles.selector'

@Component({
    selector: 'app-vehicles-table',
    standalone: false,
    templateUrl: './vehicles-table.component.html',
    styleUrls: ['./vehicles-table.component.scss']
})
export class VehiclesTableComponent implements OnInit {
    constructor(
        private store: Store, 
        @Optional() @Inject(MAT_DIALOG_DATA)private dialog: MatDialog
    ) {
        this.vehicles$ = this.store.select(selectVehiclesList);
        this.loading$ = this.store.select(selectVehiclesLoading);
        this.page$ = this.store.select(selectVehiclesPage);
        this.pageSize$ = this.store.select(selectVehiclesPageSize);
        this.total$ = this.store.select(selectVehiclesTotal);
    }

    @Input() vehicles$: Observable<Vehicle[]>;
    @Input() loading$: Observable<boolean>;
    @Input() page$: Observable<number>;
    @Input() pageSize$: Observable<number>;
    @Input() total$: Observable<number>;

    @Output() edit = new EventEmitter<Vehicle>();
    @Output() delete = new EventEmitter<number>();
    @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();

    dataSource = new MatTableDataSource<Vehicle>();
    
    columns = ['id', 'name', 'coordinates', 'creationDate', 'type', 
        'enginePower', 'numberOfWheels', 'capacity', 'distanceTravelled', 
        'fuelConsumption', 'fuelType'];
    page = 1;
    pageSize = 10;
    total = 0;
    sortBy: string = 'id';
    ascending: boolean = true;

    private destroy$ = new Subject<void>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit() {
        this.store.select(selectVehiclesList)
            .pipe(takeUntil(this.destroy$))
            .subscribe(list => {
                this.dataSource.data = list || [];
            });
        this.loadVehicles();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe(ev => {
            this.store.dispatch(VehiclesActions.loadVehicles({
                page: ev.pageIndex,
                pageSize: ev.pageSize,
                sortBy: this.sort.active,
                ascending: (this.sort.direction || null) as any,
                fuelType: "",
                min: null, max: null, filter: ""
            }));
        });

        this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.paginator.pageIndex = 0;
            this.store.dispatch(VehiclesActions.loadVehicles({
                page: 0,
                pageSize: this.paginator.pageSize,
                sortBy: this.sort.active,
                ascending: (this.sort.direction || null) as any,
                fuelType: "",
                min: null, max: null, filter: ""
            }));
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadVehicles() {
        this.store.dispatch(VehiclesActions.loadVehicles({
            page: this.page,
            pageSize: this.pageSize,
            sortBy: this.sortBy,
            ascending: this.ascending,
            fuelType: "",
            min: null, max: null, filter: ""
        }));
    }

    sortFunction(column: string) {
        if (this.sortBy === column) {
            this.ascending = this.ascending;
        } else {
            this.sortBy = column;
            this.ascending = true;
        }
        this.loadVehicles();
    }

    prevPage() {
        if (this.page > 0) {
            this.page--;
            this.loadVehicles();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.total / this.pageSize);
        if (this.page < totalPages - 1) {
            this.page++;
            this.loadVehicles();
        }
    }
    openCreate() {
        this.dialog.open(VehicleFormDialogComponent, {
            width: '500px',
            data: { mode: 'create' },
        });
    }

    openEdit(vehicle: Vehicle) {
        this.dialog.open(VehicleFormDialogComponent, {
            width: '500px',
            data: { mode: 'edit', vehicle },
        });
    }
    get totalPages() {
        return Math.ceil(this.total / this.pageSize);
    }

    onEdit(row: Vehicle) {
        this.edit.emit(row);
    }

    onDelete(row: Vehicle) {
        this.delete.emit(row.id);
    }
}
