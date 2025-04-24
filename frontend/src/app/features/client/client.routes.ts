import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
  {
    path: 'solicitation',
    loadComponent: () => import('./solicitation/solicitation.component').then(m => m.ClientHomeComponent),
  },
];
