import { Routes } from '@angular/router';
import { noAuthGuard } from './guards/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    canActivate: [noAuthGuard],
  },

  {
    path: 'orcamento',
    loadComponent: () => import('../client/budget/budget-approve.component').then(m => m.BudgetApproveComponent),
  },
];
