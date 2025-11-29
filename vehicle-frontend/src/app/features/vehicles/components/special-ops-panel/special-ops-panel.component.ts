import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as SpecialOpsActions from '../../store/actions/special-ops.actions';
import {
  selectSpecialOpsLoading,
  selectSpecialOpsResult,
  selectSpecialOpsError,
  selectSpecialOpsCurrentOp
} from '../../store/selectors/special-ops.selector';
import { SharedMaterialModule } from '../../../../common/shared-material/shared-material.module';

@Component({
  selector: 'app-special-ops-panel',
  standalone: true,
  imports: [
    SharedMaterialModule
  ],
  templateUrl: './special-ops-panel.component.html',
  styleUrls: ['./special-ops-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialOpsPanelComponent {
  @Input() loading$: Observable<boolean>;
  @Input() result$: Observable<any>
  @Input() error$: Observable<any>;
  @Input() currentOp$: Observable<string | null | undefined>;

  @Input() resetId: number | null = null;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectSpecialOpsLoading);
    this.result$ = this.store.select(selectSpecialOpsResult);
    this.error$ = this.store.select(selectSpecialOpsError);
    this.currentOp$ = this.store.select(selectSpecialOpsCurrentOp);
  }

  runSum() {
    this.store.dispatch(SpecialOpsActions.specialOpTriggered({ op: 'sumFuelConsumption' }));
  }

  runGroup() {
    this.store.dispatch(SpecialOpsActions.specialOpTriggered({ op: 'groupByFuelConsumption' }));
  }

  runResetDistance() {
    this.store.dispatch(SpecialOpsActions.specialOpTriggered({
      op: 'resetDistanceToZero',
      payload: { id: Number(this.resetId) }
    }));
  }
  isArray(value: any): value is any[] {
    return Array.isArray(value);
  }
  clear() {
    this.store.dispatch(SpecialOpsActions.specialOpClear());
  }

  isNumber(value: any): value is number {
    return typeof value === 'number';
  }
}
