import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { DoMaintenanceComponent } from '../../../features/employee/requests/do-maintenance/do-maintenance.component';
import { QuoteMaintenenceModalComponent } from '../../../features/employee/requests/quote-maintenence/quote-maintenence.component';
import { RedirectMaintenanceComponent } from '../../../features/employee/requests/redirect-maintenance/redirect-maintenance.component';
import { EmployeeRequestService } from '../../../features/employee/shared/services/employee-request.service';
import { MaintenanceAction, MaintenanceRequest, MaintenanceRequestStrategy } from '../../models/maintenanceRequest';
import { SolicitationState } from '../../models/SolicitationState';
import { MaintenanceActionData } from '../models/maintenanceActionComponent';
import { MaintenanceActionService } from '../services/maintenance-action.service';
@Injectable()
export class EmployeeMaintenanceRequestStrategy implements MaintenanceRequestStrategy {
  private readonly requestService = inject(EmployeeRequestService);
  private readonly actionService = inject(MaintenanceActionService);

  getRequest(requestId: string): Observable<MaintenanceRequest> {
    return this.requestService.getById(requestId).pipe(map(response => response.data));
  }
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[] {
    switch (request.state) {
      case SolicitationState.OPEN:
        return [MaintenanceAction.QUOTE];
      case SolicitationState.APPROVED:
        return [MaintenanceAction.REDIRECT, MaintenanceAction.DO_MAINTENANCE];
      case SolicitationState.REDIRECTED:
        return [MaintenanceAction.REDIRECT, MaintenanceAction.DO_MAINTENANCE];
      case SolicitationState.FIXED:
        return [MaintenanceAction.COMPLETE];
      default:
        return [];
    }
  }

  executeAction(requestId: string, action: MaintenanceAction): Observable<void> {
    console.log('Executing action:', action, 'for request:', requestId);
    type SupportedActions =
      | MaintenanceAction.COMPLETE
      | MaintenanceAction.QUOTE
      | MaintenanceAction.REDIRECT
      | MaintenanceAction.DO_MAINTENANCE;

    const actionResult: Record<SupportedActions, () => Observable<void>> = {
      [MaintenanceAction.COMPLETE]: () => this.requestService.finalize(requestId),
      [MaintenanceAction.QUOTE]: () => this.quoteAction(requestId),
      [MaintenanceAction.REDIRECT]: () => this.redirectAction(requestId),
      [MaintenanceAction.DO_MAINTENANCE]: () => this.doMaintenanceAction(requestId),
    };

    return actionResult[action as SupportedActions]();
  }

  quoteAction(requestId: string) {
    console.log('Opening quote action modal for request:', requestId);
    const actionData: MaintenanceActionData<string | null> = {
      title: 'Orçar Manutenção',
      actionName: MaintenanceAction.QUOTE,
      component: QuoteMaintenenceModalComponent,
    };
    return this.actionService.openActionModal(actionData).pipe(
      switchMap(price => {
        if (!price) return of();
        return this.requestService.quote(requestId, price);
      })
    );
  }

  redirectAction(requestId: string) {
    const actionData: MaintenanceActionData<string | null> = {
      title: 'Redirecionar Manutenção',
      actionName: MaintenanceAction.REDIRECT,
      component: RedirectMaintenanceComponent,
    };
    return this.actionService.openActionModal(actionData).pipe(
      switchMap(newEmployeeId => {
        if (!newEmployeeId) return of();
        return this.requestService.redirect(requestId, newEmployeeId);
      })
    );
  }

  doMaintenanceAction(requestId: string) {
    const actionData: MaintenanceActionData<string | null> = {
      title: 'Orçar Manutenção',
      actionName: MaintenanceAction.DO_MAINTENANCE,
      component: DoMaintenanceComponent,
    };
    return of();
    // return this.actionService.openActionModal(actionData).pipe(
    //   switchMap((maintenanceInfo: MaintenanceInfo) => {
    //     if (!maintenanceInfo) return of();
    //     return this.requestService.doMaintenence(requestId, maintenanceInfo);
    //   })
    // );
  }
}
