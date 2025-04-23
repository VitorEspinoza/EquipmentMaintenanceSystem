import { Routes } from '@angular/router';
import { authRoutes } from '../app/features/auth/auth.routes';
import { clientRoutes } from './features/client/client.routes';

export const routes: Routes = [...authRoutes, ...clientRoutes];
