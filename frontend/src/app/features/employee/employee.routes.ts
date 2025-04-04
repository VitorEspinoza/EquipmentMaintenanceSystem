import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: 'employee-home',
    loadComponent: () =>
      import('./employee-home/employee-home/employee-home.component').then(m => m.EmployeeHomeComponent),
  },
];
