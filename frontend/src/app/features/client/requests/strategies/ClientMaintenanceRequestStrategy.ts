import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  MaintenanceAction,
  MaintenanceRequestStrategy,
} from '../../../requests/shared/models/maintenanceActionComponent';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenanceRequest';
import { RequestState } from '../../../requests/shared/models/RequestState';
import { ClientRequestService } from '../../shared/services/client-request.service';

@Injectable()
export class ClientMaintenanceRequestStrategy implements MaintenanceRequestStrategy {
  readonly requestService = inject(ClientRequestService);

  getRequest(requestId: string): Observable<MaintenanceRequest> {
    return this.requestService.getById(requestId).pipe(map(response => response.data));
  }
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[] {
    switch (request.translatedState) {
      case RequestState.QUOTED:
        return [MaintenanceAction.APPROVE, MaintenanceAction.REJECT];
      case RequestState.REJECTED:
        return [MaintenanceAction.RESCUE];
      case RequestState.FIXED:
        return [MaintenanceAction.PAY];
      default:
        return [];
    }
  }
}
