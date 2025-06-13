import { Routes } from '@angular/router';
import { MAINTENANCE_REQUEST_STRATEGY } from '../requests/shared/models/maintenanceActionComponent';
import { EmployeeMaintenanceRequestStrategy } from './requests/EmployeeMaintenanceRequestStrategy';
export const employeeRoutes: Routes = [
  {
    path: 'employee/requests',
    loadComponent: () =>
      import('./requests/employee-request-list/employee-request-list.component').then(
        m => m.EmployeeRequestListComponent
      ),
  },
  {
    path: 'employee/manage',
    loadComponent: () => import('./manage/manage.component').then(m => m.ManageComponent),
  },
  {
    path: 'employee/requests/:requestId',
    loadComponent: () =>
      import('./requests/employee-maintenance-request-details/employee-maintenance-request-details.component').then(
        m => m.EmployeeMaintenanceRequestDetailsComponent
      ),
    providers: [
      {
        provide: MAINTENANCE_REQUEST_STRATEGY,
        useClass: EmployeeMaintenanceRequestStrategy,
      },
    ],
  },
];
