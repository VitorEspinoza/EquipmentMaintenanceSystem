import { Routes } from '@angular/router';
import { authRoutes } from '../app/features/auth/auth.routes';
import { clientRoutes } from './features/client/client.routes';
import { employeeRoutes } from './features/employee/employee.routes';
import { equipmentCategoryRoutes } from './features/equipment-category/equipment-category.routes';
import { LayoutComponent } from './features/layout/layout/layout.component';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: LayoutComponent,
    children: [...clientRoutes, ...employeeRoutes, ...equipmentCategoryRoutes],
  },
];
