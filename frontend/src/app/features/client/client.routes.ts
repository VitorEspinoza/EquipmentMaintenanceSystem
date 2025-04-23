import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
  {
    path: 'client-home',
    loadComponent: () => import('./client-home/client-home.component').then(m => m.ClientHomeComponent),
  },
  {
    path: 'client/solicitation/:idSolicitation',
    loadComponent: () =>
      import('./client-solicitation/client-solicitation.component').then(m => m.ClientSolicitationComponent),
  },
];
