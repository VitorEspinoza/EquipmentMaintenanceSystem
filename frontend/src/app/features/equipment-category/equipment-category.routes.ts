import { Routes } from '@angular/router';
import { Role } from '../../core/models/role';

export const equipmentCategoryRoutes: Routes = [
  {
    path: 'employee/equipment-category',
    loadComponent: () =>
      import('../equipment-category/manage-equipment-category/equipment-category.component').then(
        m => m.EquipmentCategoryComponent
      ),
    data: { permissions: [Role.EMPLOYEE] },
  },
];
