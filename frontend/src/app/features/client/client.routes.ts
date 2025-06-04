import { Routes } from '@angular/router';
import { ClientMaintenanceRequestStrategy } from '../../shared/maintenance-request-details/strategies/ClientMaintenanceRequestStrategy';
import { MAINTENANCE_REQUEST_STRATEGY } from '../../shared/models/maintenanceRequest';

export const clientRoutes: Routes = [
  {
    path: 'client/requests',
    loadComponent: () =>
      import('./client-request-list/client-request-list.component').then(m => m.ClientRequestListComponent),
  },
  {
    path: 'client/request/:requestId',
    loadComponent: () =>
      import('./../../shared/maintenance-request-details/maintenance-request-details.component').then(
        m => m.MaintenanceRequestDetailsComponent
      ),
    providers: [
      {
        provide: MAINTENANCE_REQUEST_STRATEGY,
        useClass: ClientMaintenanceRequestStrategy,
      },
    ],
  },
];
