import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { MaintenanceAction, MaintenanceRequestStrategy } from '../../requests/shared/models/maintenanceActionComponent';
import { MaintenanceRequest } from '../../requests/shared/models/maintenanceRequest';
import { RequestState } from '../../requests/shared/models/RequestState';
import { EmployeeRequestService } from '../services/employee-request.service';
@Injectable()
export class EmployeeMaintenanceRequestStrategy implements MaintenanceRequestStrategy {
  readonly requestService = inject(EmployeeRequestService);

  getRequest(requestId: string): Observable<MaintenanceRequest> {
    return this.requestService.getById(requestId).pipe(map(response => response.data));
  }
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[] {
    switch (request.translatedState) {
      case RequestState.OPEN:
        return [MaintenanceAction.QUOTE];
      case RequestState.APPROVED:
        return [MaintenanceAction.REDIRECT, MaintenanceAction.DO_MAINTENANCE];
      case RequestState.REDIRECTED:
        return [MaintenanceAction.REDIRECT, MaintenanceAction.DO_MAINTENANCE];
      case RequestState.PAID:
        return [MaintenanceAction.COMPLETE];
      default:
        return [];
    }
  }
}
