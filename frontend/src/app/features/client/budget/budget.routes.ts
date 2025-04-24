import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
  {
    path: 'budgetapprove',
    //canActivate: [authGuard],
    loadComponent: () => import('./budget-approve.component').then(m => m.BudgetApproveComponent),
  },
];
