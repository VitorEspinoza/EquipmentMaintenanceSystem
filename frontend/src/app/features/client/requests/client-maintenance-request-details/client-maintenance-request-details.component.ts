import { Component, input } from '@angular/core';
import { BaseMaintenanceRequestDetailsComponent } from '../../../requests/shared/components/base-maintenance-request-details/base-maintenance-request-details.component';
import { MAINTENANCE_REQUEST_DETAILS_STRATEGY } from '../../../requests/shared/models/strategies/maintenance-request-details-strategy';
import { ClientMaintenanceRequestDetailsStrategy } from '../strategies/client-maintenance-request-details-strategy';

@Component({
  selector: 'app-client-maintenance-request-details',
  imports: [BaseMaintenanceRequestDetailsComponent],
  templateUrl: './client-maintenance-request-details.component.html',
  styleUrl: './client-maintenance-request-details.component.css',
  providers: [
    {
      provide: MAINTENANCE_REQUEST_DETAILS_STRATEGY,
      useClass: ClientMaintenanceRequestDetailsStrategy,
    },
  ],
})
export class ClientMaintenanceRequestDetailsComponent {
  readonly requestId = input.required<string>();
}
