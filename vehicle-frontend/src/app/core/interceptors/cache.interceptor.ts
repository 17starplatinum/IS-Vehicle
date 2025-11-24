import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  entryTime: number;
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, CacheEntry>();
  private ttl = 1000 * 60;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    if (req.params.has('noCache') && req.params.get('noCache') === 'true') {
      return next.handle(req);
    }

    const url = req.urlWithParams;
    const cached = this.cache.get(url);
    const now = Date.now();
    if (cached && (now - cached.entryTime) < this.ttl) {
      return of(cached.response.clone());
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(url, { url, response: event.clone(), entryTime: Date.now() });
        }
      })
    );
  }

  invalidateUrl(url: string) {
    this.cache.delete(url);
  }
}
