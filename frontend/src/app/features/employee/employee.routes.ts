import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: 'equipment-category',
    loadComponent: () =>
      import('./equipment-category/equipment-category.component').then(m => m.EquipmentCategoryComponent),
  },
];
