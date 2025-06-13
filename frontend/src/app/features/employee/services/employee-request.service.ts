import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { DefaultResponse } from '../../../shared/models/DefaultResponse';
import { translateRequestState } from '../../../shared/utils';
import {
  IMaintenanceRequestService,
  MaintenanceAction,
  MaintenanceActionData,
} from '../../requests/shared/models/maintenanceActionComponent';
import { MaintenanceRequest } from '../../requests/shared/models/maintenanceRequest';
import { MaintenanceActionService } from '../../requests/shared/services/maintenance-action.service';
import { DoMaintenanceComponent } from '../requests/do-maintenance/do-maintenance.component';
import { QuoteMaintenenceModalComponent } from '../requests/quote-maintenence/quote-maintenence.component';
import { RedirectMaintenanceComponent } from '../requests/redirect-maintenance/redirect-maintenance.component';
import { MaintenanceInfo } from '../shared/models/maintenanceInfo';

@Injectable({
  providedIn: 'root',
})
export class EmployeeRequestService implements IMaintenanceRequestService {
  private readonly crudService = inject(CrudService);
  private readonly actionService = inject(MaintenanceActionService);

  private endpoint = 'employee/maintenance-request';

  getAll(params?: HttpParams): Observable<DefaultResponse<MaintenanceRequest[]>> {
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

  finalize(id: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/finalize`, {});
  }

  quote(id: string, price: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/quote`, { price });
  }

  redirect(id: string, newEmployeeId: number): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/redirect?newEmployeeId=${newEmployeeId}`, {});
  }

  doMaintenence(id: string, maintenanceInfo: MaintenanceInfo): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/do-maintenance`, {
      ...maintenanceInfo,
    });
  }

  executeAction(requestId: string, action: MaintenanceAction): Observable<void> {
    type SupportedActions =
      | MaintenanceAction.COMPLETE
      | MaintenanceAction.QUOTE
      | MaintenanceAction.REDIRECT
      | MaintenanceAction.DO_MAINTENANCE;

    const actionResult: Record<SupportedActions, () => Observable<void>> = {
      [MaintenanceAction.COMPLETE]: () => this.finalize(requestId),
      [MaintenanceAction.QUOTE]: () => this.quoteAction(requestId),
      [MaintenanceAction.REDIRECT]: () => this.redirectAction(requestId),
      [MaintenanceAction.DO_MAINTENANCE]: () => this.doMaintenanceAction(requestId),
    };

    return actionResult[action as SupportedActions]();
  }

  quoteAction(requestId: string) {
    const actionData: MaintenanceActionData<string | null> = {
      title: 'Orçar Manutenção',
      actionName: MaintenanceAction.QUOTE,
      component: QuoteMaintenenceModalComponent,
    };
    return this.actionService.openActionModal(actionData).pipe(
      switchMap(price => {
        if (!price) return EMPTY;
        return this.quote(requestId, price);
      })
    );
  }

  redirectAction(requestId: string) {
    const actionData: MaintenanceActionData<number | null> = {
      title: 'Redirecionar Manutenção',
      actionName: MaintenanceAction.REDIRECT,
      component: RedirectMaintenanceComponent,
    };
    return this.actionService.openActionModal(actionData).pipe(
      switchMap(newEmployeeId => {
        if (!newEmployeeId) return EMPTY;
        return this.redirect(requestId, newEmployeeId);
      })
    );
  }

  doMaintenanceAction(requestId: string) {
    const actionData: MaintenanceActionData<MaintenanceInfo | null> = {
      title: 'Realizar Manutenção',
      actionName: MaintenanceAction.DO_MAINTENANCE,
      component: DoMaintenanceComponent,
    };
    return this.actionService.openActionModal(actionData).pipe(
      switchMap(maintenanceInfo => {
        if (!maintenanceInfo) return EMPTY;
        return this.doMaintenence(requestId, maintenanceInfo);
      })
    );
  }
}
