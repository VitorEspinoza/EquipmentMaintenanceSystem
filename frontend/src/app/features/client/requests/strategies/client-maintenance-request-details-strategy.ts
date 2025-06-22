import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenance-request';

import { MaintenanceAction } from '../../../requests/shared/models/maintenance-action/maintenance-action';
import { MaintenanceRequestState } from '../../../requests/shared/models/maintenance-request-state';
import { MaintenanceRequestDetailsStrategy } from '../../../requests/shared/models/strategies/maintenance-request-details-strategy';
import { ClientRequestService } from '../../shared/services/client-request.service';

@Injectable()
export class ClientMaintenanceRequestDetailsStrategy implements MaintenanceRequestDetailsStrategy {
  readonly requestService = inject(ClientRequestService);

  getRequest(requestId: string): Observable<MaintenanceRequest> {
    return this.requestService.getById(requestId).pipe(map(response => response.data));
  }
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[] {
    switch (request.translatedState) {
      case MaintenanceRequestState.QUOTED:
        return [MaintenanceAction.APPROVE, MaintenanceAction.REJECT];
      case MaintenanceRequestState.REJECTED:
        return [MaintenanceAction.RESCUE];
      case MaintenanceRequestState.FIXED:
        return [MaintenanceAction.PAY];
      default:
        return [];
    }
  }
}
