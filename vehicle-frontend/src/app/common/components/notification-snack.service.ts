import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationSnackService {
  constructor(private snack: MatSnackBar) {}

  success(msg: string) { this.snack.open(msg, 'OK', { duration: 3000, panelClass: 'snack-success' }); }
  info(msg: string) { this.snack.open(msg, 'OK', { duration: 4000, panelClass: 'snack-info' }); }
  warn(msg: string) { this.snack.open(msg, 'OK', { duration: 5000, panelClass: 'snack-warn' }); }
  error(msg: string) { this.snack.open(msg, 'Close', { duration: 0, panelClass: 'snack-error' }); } // no auto close
}
