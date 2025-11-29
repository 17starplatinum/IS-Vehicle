import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as VehiclesActions from './store/actions/vehicles.actions';
import * as VehiclesSelectors from './store/selectors/vehicles.selector';
import { Observable } from 'rxjs';
import { Vehicle } from './store/models/vehicles.models';

@Injectable({ providedIn: 'root' })
export class VehiclesFacade {
  list$: Observable<Vehicle[]>;
  loading$: Observable<boolean>;
  page$: Observable<number>;
  pageSize$: Observable<number>;
  total$: Observable<number>;
  selectedVehicle$ = (id: number) => this.store.select(VehiclesSelectors.selectVehicleById(id));

  constructor(private store: Store) {
    this.list$ = this.store.select(VehiclesSelectors.selectVehiclesList);
    this.loading$ = this.store.select(VehiclesSelectors.selectVehiclesLoading);
    this.page$ = this.store.select(VehiclesSelectors.selectVehiclesPage);
    this.pageSize$ = this.store.select(VehiclesSelectors.selectVehiclesPageSize);
    this.total$ = this.store.select(VehiclesSelectors.selectVehiclesTotal);
  }

  loadPage(page = 0, pageSize = 10, sortBy = 'id', ascending = true, fuelType = "", min = null, max = null, filter = "") {
    this.store.dispatch(VehiclesActions.loadVehicles({ page, pageSize, sortBy, ascending, fuelType, min, max, filter }));
  }


  create(vehicle: any) {
    this.store.dispatch(VehiclesActions.createVehicle({ vehicle }));
  }

  update(id: number, changes: any) {
    this.store.dispatch(VehiclesActions.updateVehicle({ id, changes }));
  }

  delete(id: number) {
    this.store.dispatch(VehiclesActions.deleteVehicle({ id }));
  }

  loadOne(id: number) {
    this.store.dispatch(VehiclesActions.loadVehicle({ id }));
  }
}
