import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { employeeRoutes } from './features/employee/budget/budget.routes';

export const routes: Routes = [
  ...authRoutes,
  ...employeeRoutes
];
