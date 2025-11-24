import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ContentTypeInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isForm = req.body instanceof FormData;
    if (isForm || req.headers.has('Content-Type')) {
      return next.handle(req);
    }

    const headers = req.headers
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json; charset=utf-8');

    const cloned = req.clone({ headers });
    return next.handle(cloned);
  }
}
