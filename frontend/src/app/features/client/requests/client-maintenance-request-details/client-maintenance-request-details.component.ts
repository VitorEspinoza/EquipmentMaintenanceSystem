import { Component, input } from '@angular/core';
import { BaseMaintenanceRequestDetailsComponent } from '../../../requests/shared/components/base-maintenance-request-details/base-maintenance-request-details.component';

@Component({
  selector: 'app-client-maintenance-request-details',
  imports: [BaseMaintenanceRequestDetailsComponent],
  templateUrl: './client-maintenance-request-details.component.html',
  styleUrl: './client-maintenance-request-details.component.css',
})
export class ClientMaintenanceRequestDetailsComponent {
  readonly requestId = input.required<string>();
}
