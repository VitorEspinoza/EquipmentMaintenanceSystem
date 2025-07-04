import { Routes } from '@angular/router';
import { Role } from '../../core/models/role';
import { permissionsGuard } from '../auth/guards/permissions.guard';

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
  },
];
