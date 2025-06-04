import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { BudgetRejectionModalComponent } from '../../../features/client/budget/shared/components/budget-rejection-modal/budget-rejection-modal.component';
import { ClientRequestService } from '../../../features/client/shared/services/client-request.service';
import { MaintenanceAction, MaintenanceRequest, MaintenanceRequestStrategy } from '../../models/maintenanceRequest';
import { SolicitationState } from '../../models/SolicitationState';
import { MaintenanceActionData } from '../models/maintenanceActionComponent';
import { MaintenanceActionService } from '../services/maintenance-action.service';
@Injectable()
export class ClientMaintenanceRequestStrategy implements MaintenanceRequestStrategy {
  private readonly requestService = inject(ClientRequestService);
  private readonly actionService = inject(MaintenanceActionService);
  getRequest(requestId: string): Observable<MaintenanceRequest> {
    return this.requestService.getById(requestId).pipe(map(response => response.data));
  }
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[] {
    switch (request.state) {
      case SolicitationState.QUOTED:
        return [MaintenanceAction.APPROVE, MaintenanceAction.REJECT];
      case SolicitationState.REJECTED:
        return [MaintenanceAction.RESCUE];
      case SolicitationState.FIXED:
        return [MaintenanceAction.PAY];
      default:
        return [];
    }
  }

  executeAction(requestId: string, action: MaintenanceAction): any {
    type SupportedActions =
      | MaintenanceAction.APPROVE
      | MaintenanceAction.REJECT
      | MaintenanceAction.RESCUE
      | MaintenanceAction.PAY;

    const actionResult: Record<SupportedActions, () => Observable<void>> = {
      [MaintenanceAction.APPROVE]: () => this.requestService.approve(requestId),
      [MaintenanceAction.RESCUE]: () => this.requestService.approve(requestId),
      [MaintenanceAction.PAY]: () => this.requestService.pay(requestId),
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
        if (!rejectionReason) return of();
        return this.requestService.reject(requestId, rejectionReason);
      })
    );
  }
}
