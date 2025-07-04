import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';
import { NotificationConfig } from '../interfaces/notificationConfig';

type NotificationType = 'success' | 'info' | 'error' | 'warning';

interface NotificationDefaults {
  duration: number;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaults: Record<NotificationType, NotificationDefaults> = {
    success: { duration: 3000, title: 'Sucesso' },
    info: { duration: 3000, title: 'Informação' },
    error: { duration: 3000, title: 'Ocorreu um erro' },
    warning: { duration: 3000, title: 'Atenção' },
  };

  private show(config: NotificationConfig) {
    const snackBarConfig: MatSnackBarConfig = {
      duration: config.duration,
      data: config.data,
      horizontalPosition: config.position?.horizontal || 'right',
      verticalPosition: config.position?.vertical || 'top',
      panelClass: ['custom-notification', config.data.type],
    };

    return this.snackBar.openFromComponent(NotificationComponent, snackBarConfig);
  }

  private notify(type: NotificationType, message: string, title?: string, duration?: number) {
    const defaults = this.defaults[type];

    this.show({
      data: {
        title: title || defaults.title,
        message,
        type,
      },
      duration: duration || defaults.duration,
    });
  }

  success(message: string, title?: string, duration?: number) {
    this.notify('success', message, title, duration);
  }

  info(message: string, title?: string, duration?: number) {
    this.notify('info', message, title, duration);
  }

  error(message: string, title?: string, duration?: number) {
    this.notify('error', message, title, duration);
  }

  warning(message: string, title?: string, duration?: number) {
    this.notify('warning', message, title, duration);
  }

  close() {
    this.snackBar.dismiss();
  }
}
