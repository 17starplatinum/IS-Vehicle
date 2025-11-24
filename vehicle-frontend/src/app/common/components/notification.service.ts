import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NotificationItem, NotificationLevel, NotificationAction } from './notification.models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private bus = new Subject<NotificationItem>();
  public events$: Observable<NotificationItem> = this.bus.asObservable();

  constructor() {}

  private buildItem(level: NotificationLevel, message: string, title?: string, ttl: number | null = 5000, actions?: NotificationAction[], payload?: any): NotificationItem {
    return {
      id: uuidv4 ? uuidv4() : `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      level,
      title,
      message,
      ttl,
      actions,
      createdAt: Date.now(),
      sticky: ttl === null,
      payload
    };
  }

  success(message: string, title?: string, ttl: number | null = 3000, actions?: NotificationAction[], payload?: any) {
    this.bus.next(this.buildItem('success', message, title, ttl, actions, payload));
  }

  info(message: string, title?: string, ttl: number | null = 4000, actions?: NotificationAction[], payload?: any) {
    this.bus.next(this.buildItem('info', message, title, ttl, actions, payload));
  }

  warn(message: string, title?: string, ttl: number | null = 5000, actions?: NotificationAction[], payload?: any) {
    this.bus.next(this.buildItem('warn', message, title, ttl, actions, payload));
  }

  error(message: string, title?: string, ttl: number | null = null, actions?: NotificationAction[], payload?: any) {
    this.bus.next(this.buildItem('error', message, title, ttl, actions, payload));
  }

  showValidationErrors(fieldErrors: Record<string,string[]>, title?: string) {
    const msgs = Object.entries(fieldErrors).map(([f, errs]) => `${f}: ${errs.join(', ')}`);
    this.error(msgs.join('\n'), title, null, undefined, { validation: fieldErrors });
  }
}
