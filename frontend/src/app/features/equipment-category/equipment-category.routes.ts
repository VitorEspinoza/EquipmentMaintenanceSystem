import { Routes } from '@angular/router';

export const equipmentCategoryRoutes: Routes = [
  {
    path: 'employee/equipment-category',
    loadComponent: () =>
      import('../equipment-category/manage-equipment-category/equipment-category.component').then(
        m => m.EquipmentCategoryComponent
      ),
  },
];
