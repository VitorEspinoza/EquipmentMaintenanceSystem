import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { clientRoutes } from './features/client/budget/budget.routes';

export const routes: Routes = [
  ...authRoutes,
  ...clientRoutes,
];
