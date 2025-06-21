import { Routes } from '@angular/router';
import { authRoutes } from '../app/features/auth/auth.routes';
import { EmptyRedirectComponent } from './core/components/empty-route/empty-route.component';
import { authRedirectGuard } from './features/auth/guards/auth-redirect.guard';
import { clientRoutes } from './features/client/client.routes';
import { employeeRoutes } from './features/employee/employee.routes';
import { equipmentCategoryRoutes } from './features/equipment-category/equipment-category.routes';
import { LayoutComponent } from './features/layout/layout/layout.component';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: LayoutComponent,
    children: [
      ...clientRoutes,
      ...employeeRoutes,
      ...equipmentCategoryRoutes,
      {
        path: '',
        canActivate: [authRedirectGuard],
        component: EmptyRedirectComponent,
      },
      { path: '**', component: EmptyRedirectComponent, canActivate: [authRedirectGuard] },
    ],
  },
];
