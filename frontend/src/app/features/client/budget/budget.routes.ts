import { Routes } from '@angular/router';
import { authGuard } from '../../../core/services/guards/auth.guard';

export const clientRoutes: Routes = [
  {
    path: 'budgetapprove',
    //canActivate: [authGuard],
    loadComponent: () => import('./budget-approve.component').then(m => m.BudgetApproveComponent),
  },
];
