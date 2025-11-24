import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, timer, defer, EMPTY } from 'rxjs';
import { map, retryWhen, delayWhen, tap, switchMap, shareReplay, takeUntil, catchError } from 'rxjs/operators';

export type ServerResource = 'vehicle' | 'coordinates' | 'unknown';
export type ServerAction = 'CREATED' | 'UPDATED' | 'DELETED' | 'RESET_DISTANCE' | string;

export interface WsEvent {
  resource: ServerResource;
  action: ServerAction;
  id: number | null;
  raw: string;
}

@Injectable({ providedIn: 'root' })
export class WsService implements OnDestroy {
  private stop$ = new Subject<void>();
  public events$: Observable<WsEvent>;

  private url = '/vehicles-updates';

  constructor() {
    this.events$ = this.createWsStream().pipe(
      takeUntil(this.stop$),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private createWsStream(): Observable<WsEvent> {
    return defer(() => {
      return new Observable<WsEvent>((subscriber) => {
        const ws = new WebSocket(this.url);

        ws.onopen = () => {
          console.info('[WsService] connected', this.url);
        };

        ws.onmessage = (ev) => {
          const txt = ev.data?.toString?.() ?? '';
          try {
            const parsed = this.parseTextMessage(txt);
            if (parsed) subscriber.next(parsed);
          } catch (err) {
            console.warn('[WsService] parse error', err, txt);
          }
        };

        ws.onerror = (err) => {
          console.warn('[WsService] socket error', err);
          subscriber.error(err);
        };

        ws.onclose = (ev) => {
          subscriber.error(new Error('WebSocket closed'));
        };

        return () => {
          try { ws.close(); } catch (e) {

          }
        };
      }).pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(err => console.warn('[WsService] connection lost, will retry...', err)),
            delayWhen((_, i) => {
              const base = Math.min(30000, Math.pow(2, i) * 1000);
              const jitter = Math.floor(Math.random() * 1000);
              return timer(base + jitter);
            })
          )
        ),
        catchError(err => {
          console.error('[WsService] fatal ws error', err);
          return EMPTY;
        })
      );
    });
  }

  private parseTextMessage(txt: string): WsEvent | null {
    if (!txt || typeof txt !== 'string') return null;
    const raw = txt.trim();

    const norm = raw.replace(/\s+/, ' ').trim();

    const m1 = norm.match(/^([A-Z ]+?)\s*:\s*(\d+)\s*$/i);
    const m2 = norm.match(/^([A-Z ]+?)\s+(\d+)\s*$/i);

    let actionText: string | null = null;
    let idNum: number | null = null;

    if (m1) {
      actionText = (m1[1] || '').trim().toUpperCase();
      idNum = Number(m1[2]);
    } else if (m2) {
      actionText = (m2[1] || '').trim().toUpperCase();
      idNum = Number(m2[2]);
    } else {
      return { resource: 'unknown', action: 'MESSAGE', id: null, raw };
    }

    const resource = /VEHICLE/i.test(actionText) ? 'vehicle' :
                     /COORDINATE/i.test(actionText) ? 'coordinates' : 'unknown';

    let action: ServerAction = 'UNKNOWN';
    if (/CREATE/i.test(actionText)) action = 'CREATED';
    else if (/UPDATE/i.test(actionText)) action = 'UPDATED';
    else if (/DELETE/i.test(actionText)) action = 'DELETED';
    else if (/RESET\s+VEHICLE\s+DISTANCE/i.test(actionText)) action = 'RESET_DISTANCE';
    else action = actionText;

    return { resource, action, id: idNum, raw };
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
