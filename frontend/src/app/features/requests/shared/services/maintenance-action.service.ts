import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MaintenanceRequestActionDetailsModalComponent } from '../modals/maintenance-request-action-details-modal/maintenance-request-action-details-modal.component';
import { MaintenanceActionData } from '../models/maintenanceActionComponent';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceActionService {
  private dialog = inject(MatDialog);
  openActionModal<T>(actionData: MaintenanceActionData<T>): Observable<T | false> {
    const dialogRef = this.dialog.open(MaintenanceRequestActionDetailsModalComponent, {
      data: actionData,
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
    });

    return dialogRef.afterClosed();
  }
}
