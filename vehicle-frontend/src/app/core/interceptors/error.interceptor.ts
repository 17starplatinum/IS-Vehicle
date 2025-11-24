import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationSnackService } from '../../common/components/notification-snack.service';
import { Store } from '@ngrx/store';
// import * as AuthActions from '../../features/auth/store/auth.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notif: NotificationSnackService, private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.notif.error('Network error. Please check your connection.');
        // } else if (err.status === 401) {
        // Эт потом
        //   // unauthorized
        //   this.notif.error('Session expired. Please login again.');
        //   this.store.dispatch(AuthActions.logout());
        // } else if (err.status === 403) {
        //   this.notif.error('You do not have permission to perform this action.');
        } else if (err.status >= 500) {
          this.notif.error('Ошибка сервера. Попытайтесь позже.');
        } else if (err.error && err.error.message) {
          this.notif.error(err.error.message);
        } else {
          this.notif.error(err.message || 'Unexpected error');
        }

        return throwError(() => err);
      })
    );
  }
}
