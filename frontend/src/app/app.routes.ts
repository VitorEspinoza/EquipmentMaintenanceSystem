import { Routes } from '@angular/router';
import { authRoutes } from '../app/features/auth/auth.routes';
import { LayoutComponent } from './features/layout/layout/layout.component';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: LayoutComponent,
    children: [], // Aqui dentro entram as rotas com layout, por ex: ...clientRoutes
  },
];
