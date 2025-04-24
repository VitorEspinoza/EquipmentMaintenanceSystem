import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
  {
    path: 'client/solicitations',
    loadComponent: () =>
      import('./client-solicitation-list/client-solicitation-list.component').then(
        m => m.ClientSolicitationListComponent
      ),
  },
  {
    path: 'client/solicitation/:idSolicitation',
    loadComponent: () =>
      import('./client-solicitation-detail/client-solicitation-detail.component').then(
        m => m.ClientSolicitationDetailComponent
      ),
  },
];
