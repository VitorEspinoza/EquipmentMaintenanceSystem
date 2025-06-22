import { Routes } from '@angular/router';
import { Role } from '../../core/models/role';
import { permissionsGuard } from '../auth/guards/permissions.guard';
import { MAINTENANCE_REQUEST_DETAILS_STRATEGY } from '../requests/shared/models/strategies/maintenance-request-details-strategy';
import { ClientMaintenanceRequestDetailsStrategy } from './requests/strategies/client-maintenance-request-details-strategy';

export const clientRoutes: Routes = [
  {
    path: 'client/requests',
    loadComponent: () =>
      import('./requests/client-request-list/client-request-list.component').then(m => m.ClientRequestListComponent),
    data: { permissions: [Role.CLIENT] },
    canActivate: [permissionsGuard],
  },
  {
    path: 'client/requests/:requestId',
    loadComponent: () =>
      import('./requests/client-maintenance-request-details/client-maintenance-request-details.component').then(
        m => m.ClientMaintenanceRequestDetailsComponent
      ),
    data: { permissions: [Role.CLIENT] },
    canActivate: [permissionsGuard],
    providers: [
      {
        provide: MAINTENANCE_REQUEST_DETAILS_STRATEGY,
        useClass: ClientMaintenanceRequestDetailsStrategy,
      },
    ],
  },
];
