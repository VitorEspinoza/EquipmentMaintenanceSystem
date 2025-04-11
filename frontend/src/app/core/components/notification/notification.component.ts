import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationData } from '../../interfaces/notificationData';

const MATERIAL_MODULES = [MatButtonModule, MatIconModule];
const COMMON_MODULES = [NgClass];

@Component({
  selector: 'app-notification',
  imports: [...MATERIAL_MODULES, ...COMMON_MODULES],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  private readonly snackBarRef = inject(MatSnackBarRef);

  protected readonly data = inject<NotificationData>(MAT_SNACK_BAR_DATA);

  readonly typeStyles = this.getTypeStyles();

  private getTypeStyles(): string {
    const baseClasses = 'text-white';

    switch (this.data.type) {
      case 'success':
        return `${baseClasses} bg-green-500`;
      case 'error':
        return `${baseClasses} bg-red-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-500`;
      case 'info':
        return `${baseClasses} bg-blue-500`;
    }
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
    }
  }

  close(): void {
    this.snackBarRef.dismiss();
  }
}
