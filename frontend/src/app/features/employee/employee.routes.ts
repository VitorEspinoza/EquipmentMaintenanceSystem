import { Routes } from '@angular/router';
import { Role } from '../../core/models/role';
import { permissionsGuard } from '../auth/guards/permissions.guard';
import { MAINTENANCE_REQUEST_DETAILS_STRATEGY } from '../requests/shared/models/strategies/maintenance-request-details-strategy';
import { EmployeeMaintenanceRequestDetailStrategy } from './requests/strategies/employee-maintenance-request-strategy';
export const employeeRoutes: Routes = [
  {
    path: 'employee/requests',
    loadComponent: () =>
      import('./requests/employee-request-list/employee-request-list.component').then(
        m => m.EmployeeRequestListComponent
      ),
    data: { permissions: [Role.EMPLOYEE] },
    canActivate: [permissionsGuard],
  },
  {
    path: 'employee/manage',
    loadComponent: () => import('./manage/manage-employees.component').then(m => m.ManageEmployeesComponent),
    data: { permissions: [Role.EMPLOYEE] },
    canActivate: [permissionsGuard],
  },
  {
    path: 'employee/requests/:requestId',
    loadComponent: () =>
      import('./requests/employee-maintenance-request-details/employee-maintenance-request-details.component').then(
        m => m.EmployeeMaintenanceRequestDetailsComponent
      ),
    data: { permissions: [Role.EMPLOYEE] },
    canActivate: [permissionsGuard],
    providers: [
      {
        provide: MAINTENANCE_REQUEST_DETAILS_STRATEGY,
        useClass: EmployeeMaintenanceRequestDetailStrategy,
      },
    ],
  },
];
