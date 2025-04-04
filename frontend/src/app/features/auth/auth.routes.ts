import { Routes } from '@angular/router';
import { noAuthGuard } from './guards/no-auth.guard';
import { authGuard } from '../../core/services/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
    canActivate: [noAuthGuard],
  },

  {
    path: 'orcamento',
    loadComponent: () => import('./orcamento/orcamento.component').then((m) => m.OrcamentoComponent),
  },
];
