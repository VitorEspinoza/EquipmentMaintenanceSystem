import { Routes } from '@angular/router';
import { MAINTENANCE_REQUEST_STRATEGY } from '../requests/shared/models/maintenanceActionComponent';
import { ClientMaintenanceRequestStrategy } from './requests/strategies/ClientMaintenanceRequestStrategy';

export const clientRoutes: Routes = [
  {
    path: 'client/requests',
    loadComponent: () =>
      import('./requests/client-request-list/client-request-list.component').then(m => m.ClientRequestListComponent),
  },
  {
    path: 'client/requests/:requestId',
    loadComponent: () =>
      import('./requests/client-maintenance-request-details/client-maintenance-request-details.component').then(
        m => m.ClientMaintenanceRequestDetailsComponent
      ),
    providers: [
      {
        provide: MAINTENANCE_REQUEST_STRATEGY,
        useClass: ClientMaintenanceRequestStrategy,
      },
    ],
  },
];
