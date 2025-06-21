import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { CrudService } from '../../../../core/services/crud.service';
import { DefaultResponse } from '../../../../shared/models/DefaultResponse';
import { translateRequestState } from '../../../../shared/utils';
import { FiltersFormValue } from '../../../requests/shared/models/FiltersFormValue';
import {
  IMaintenanceRequestService,
  MaintenanceAction,
  MaintenanceActionData,
} from '../../../requests/shared/models/maintenanceActionComponent';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenanceRequest';
import { FiltersStateService } from '../../../requests/shared/services/filters-state.service';
import { MaintenanceActionService } from '../../../requests/shared/services/maintenance-action.service';
import { BudgetRejectionModalComponent } from '../../requests/budget-rejection-modal/budget-rejection-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ClientRequestService implements IMaintenanceRequestService {
  private crudService = inject(CrudService);
  private actionService = inject(MaintenanceActionService);
  private filtersService = inject(FiltersStateService);
  endpoint = 'client/maintenance-request';

  getAll(): Observable<DefaultResponse<MaintenanceRequest[]>> {
    const currentFilters = this.filtersService.filters();

    const params = currentFilters ? this.convertFormToParams(currentFilters) : new HttpParams();

    return this.crudService.get<DefaultResponse<MaintenanceRequest[]>>(this.endpoint, params).pipe(
      map((response: DefaultResponse<MaintenanceRequest[]>) => ({
        ...response,
        data: response.data.map(request => translateRequestState(request)),
      }))
    );
  }

  getById(id: string): Observable<DefaultResponse<MaintenanceRequest>> {
    return this.crudService.get<DefaultResponse<MaintenanceRequest>>(`${this.endpoint}/${id}`).pipe(
      map((response: DefaultResponse<MaintenanceRequest>) => ({
        ...response,
        data: translateRequestState(response.data),
      }))
    );
  }

  create(request: MaintenanceRequest): Observable<void> {
    return this.crudService.post<void>(this.endpoint, request);
  }

  approve(id: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/approve`, {});
  }

  reject(id: string, reason: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/reject`, { reason });
  }

  pay(id: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/pay`, {});
  }

  executeAction(requestId: string, action: MaintenanceAction): any {
    type SupportedActions =
      | MaintenanceAction.APPROVE
      | MaintenanceAction.REJECT
      | MaintenanceAction.RESCUE
      | MaintenanceAction.PAY;

    const actionResult: Record<SupportedActions, () => Observable<void>> = {
      [MaintenanceAction.APPROVE]: () => this.approve(requestId),
      [MaintenanceAction.RESCUE]: () => this.approve(requestId),
      [MaintenanceAction.PAY]: () => this.pay(requestId),
      [MaintenanceAction.REJECT]: () => this.rejectAction(requestId),
    };

    return actionResult[action as SupportedActions]();
  }

  rejectAction(requestId: string): Observable<void> {
    const actionData: MaintenanceActionData<string | null> = {
      title: 'Rejeitar Manutenção',
      actionName: MaintenanceAction.REJECT,
      component: BudgetRejectionModalComponent,
    };
    return this.actionService.openActionModal(actionData).pipe(
      switchMap(rejectionReason => {
        if (!rejectionReason) return EMPTY;
        return this.reject(requestId, rejectionReason);
      })
    );
  }

  private convertFormToParams(filters: FiltersFormValue): HttpParams {
    let params = new HttpParams();
    if (!filters) return params;

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'from' || key === 'to') {
          params = params.set(key, this.formatDateOnly(new Date(value)));
        } else {
          params = params.set(key, value);
        }
      }
    });

    return params;
  }
  private formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
