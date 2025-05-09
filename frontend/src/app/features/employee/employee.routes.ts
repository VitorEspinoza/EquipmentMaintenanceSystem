import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: 'employee',
    loadComponent: () => import('./employee-home/employee-home.component').then(m => m.EmployeeHomeComponent),
  },
  {
    path: 'employee/solicitations',
    loadComponent: () =>
      import('./employee-solicitation-list/employee-solicitation-list.component').then(
        m => m.EmployeeSolicitationListComponent
      ),
  },
  {
    path: 'employee/budget/:solicitationId',
    loadComponent: () => import('./employee-budget/employee-budget.component').then(m => m.EmployeeBudgetComponent),
  },
  {
    path: 'employee/equipment-category',
    loadComponent: () =>
      import('./equipment-category/equipment-category.component').then(m => m.EquipmentCategoryComponent),
  },
  {
    path: 'employee/crud',
    loadComponent: () => import('./crud/crud.component').then(m => m.CrudComponent),
  },
];
