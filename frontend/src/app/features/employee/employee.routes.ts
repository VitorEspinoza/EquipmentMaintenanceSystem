import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: 'employee-home',
    loadComponent: () => import('./employee-home/employee-home.component').then(m => m.EmployeeHomeComponent),
  },
  {
    path: 'employee-budget',
    loadComponent: () => import('./employee-budget/employee-budget.component').then(m => m.EmployeeBudgetComponent),
  },
  {
    path: 'employee-solicitations',
    loadComponent: () =>
      import('./employee-solicitations/employee-solicitations.component').then(m => m.EmployeeSolicitationsComponent),
  },
];
