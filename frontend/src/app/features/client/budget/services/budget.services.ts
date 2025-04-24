import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../../../core/services/crud.service';
import { BudgetRequest } from '../models/budgetRequest';
import { BudgetObservation } from '../models/budgetObservation';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private crudService = inject(CrudService);
  private apiUrl = 'budgets';

  getBudgets(): Observable<BudgetRequest[]> {
    return this.crudService.get<BudgetRequest[]>(this.apiUrl);
  }

  getBudgetById(id: number): Observable<BudgetRequest> {
    return this.crudService.get<BudgetRequest>(`${this.apiUrl}/${id}`);
  }

  approveBudget(id: number): Observable<void> {
    return this.crudService.post<void>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectBudget(id: number, observation: BudgetObservation): Observable<void> {
    return this.crudService.post<void>(`${this.apiUrl}/${id}/reject`, observation);
  }
}
