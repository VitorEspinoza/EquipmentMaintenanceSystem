import { Routes } from '@angular/router';
import { authRoutes } from '../app/features/auth/auth.routes';
import { clientRoutes } from './features/client/client.routes';
import { employeeRoutes } from './features/employee/employee.routes';

export const routes: Routes = [...authRoutes, ...clientRoutes, ...employeeRoutes];
