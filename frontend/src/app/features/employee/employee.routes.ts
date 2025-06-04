import { Routes } from '@angular/router';
import { EmployeeMaintenanceRequestStrategy } from '../../shared/maintenance-request-details/strategies/EmployeeMaintenanceRequestStrategy';
import { MAINTENANCE_REQUEST_STRATEGY } from '../../shared/models/maintenanceRequest';

export const employeeRoutes: Routes = [
  {
    path: 'employee/requests',
    loadComponent: () =>
      import('./requests/employee-request-list/employee-request-list.component').then(
        m => m.EmployeeRequestListComponent
      ),
  },
  {
    path: 'employee/equipment-category',
    loadComponent: () =>
      import('./equipment-category/equipment-category.component').then(m => m.EquipmentCategoryComponent),
  },
  {
    path: 'employee/request/:requestId',
    loadComponent: () =>
      import('./../../shared/maintenance-request-details/maintenance-request-details.component').then(
        m => m.MaintenanceRequestDetailsComponent
      ),
    providers: [
      {
        provide: MAINTENANCE_REQUEST_STRATEGY,
        useClass: EmployeeMaintenanceRequestStrategy,
      },
    ],
  },
];
