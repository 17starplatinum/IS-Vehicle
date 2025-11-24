import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CoordActions from './store/actions/coords.actions';
import * as CoordSelectors from './store/selectors/coords.selector';
import { Observable } from 'rxjs';
import { Coordinates } from '../vehicles/store/models/vehicles.models';

@Injectable({ providedIn: 'root' })
export class CoordinatesFacade {
    list$: Observable<Coordinates[]>;
    loading$: Observable<boolean>;
    page$: Observable<number>;
    pageSize$: Observable<number>;
    total$: Observable<number>;
    selected$ = (id: number) => this.store.select(CoordSelectors.selectCoordinatesById(id));

  constructor(private store: Store) {
    this.list$ = this.store.select(CoordSelectors.selectCoordinatesList);
    this.loading$ = this.store.select(CoordSelectors.selectCoordinatesLoading);
    this.page$ = this.store.select(CoordSelectors.selectCoordinatesPage);
    this.pageSize$ = this.store.select(CoordSelectors.selectCoordinatesPageSize);
    this.total$ = this.store.select(CoordSelectors.selectCoordinatesTotal);
  }

  load(page = 0, pageSize = 10, sortBy = 'id', ascending = true) {
    this.store.dispatch(CoordActions.loadCoordinatesList({ page, pageSize, sortBy, ascending }));
  }

  loadOne(id: number) {
    this.store.dispatch(CoordActions.loadCoordinates({ id }));
  }

  create(coords: { x: number; y: number }) {
    this.store.dispatch(CoordActions.createCoordinates({ coordinates: coords }));
  }

  update(id: number, changes: any) {
    this.store.dispatch(CoordActions.updateCoordinates({ id, changes }));
  }

  delete(id: number) {
    this.store.dispatch(CoordActions.deleteCoordinates({ id }));
  }
}
