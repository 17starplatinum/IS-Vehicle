import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '../notification.service';
import { NotificationItem } from '../notification.models';
import { Subscription, timer } from 'rxjs';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate('200ms cubic-bezier(.2,.8,.2,1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateY(10px)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  list: NotificationItem[] = [];
  private subs = new Subscription();

  constructor(private ns: NotificationService) {}

  ngOnInit() {
    this.subs.add(this.ns.events$.subscribe(n => this.push(n)));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  push(n: NotificationItem) {
    this.list = [n, ...this.list];

    if (n.ttl != null) {
      const t = timer(n.ttl).subscribe(() => {
        this.dismiss(n.id);
        t.unsubscribe();
      });
      this.subs.add(t);
    }
  }

  dismiss(id: string) {
    this.list = this.list.filter(x => x.id !== id);
  }

  onActionClick(action: any, notification: NotificationItem) {
    try {
      action.callback?.();
    } catch (e) {
      console.error(e);
    }
    if (!notification.sticky) this.dismiss(notification.id);
  }
}
