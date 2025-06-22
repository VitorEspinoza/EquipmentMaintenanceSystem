import { Component } from '@angular/core';
import { BaseMaintenanceRequestListComponent } from '../../../requests/shared/components/base-maintenance-request-list/base-maintenance-request-list.component';
import { REQUEST_LIST_STRATEGY } from '../../../requests/shared/models/strategies/maintenance-request-list.strategy';
import { ClientRequestListStrategy } from '../strategies/client-maintenance-request-list.strategy';

@Component({
  selector: 'app-client-request-list',
  imports: [BaseMaintenanceRequestListComponent],
  templateUrl: './client-request-list.component.html',
  styleUrls: ['./client-request-list.component.css'],
  providers: [
    {
      provide: REQUEST_LIST_STRATEGY,
      useClass: ClientRequestListStrategy,
    },
  ],
})
export class ClientRequestListComponent {}
