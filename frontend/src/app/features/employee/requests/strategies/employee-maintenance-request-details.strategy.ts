import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { MaintenanceAction } from '../../../requests/shared/models/maintenance-action/maintenance-action';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenance-request';
import { MaintenanceRequestState } from '../../../requests/shared/models/maintenance-request-state';
import { EmployeeRequestService } from '../../services/employee-request.service';
@Injectable()
export class EmployeeMaintenanceRequestDetailStrategy {
  readonly requestService = inject(EmployeeRequestService);

  getRequest(requestId: string): Observable<MaintenanceRequest> {
    return this.requestService.getById(requestId).pipe(map(response => response.data));
  }
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[] {
    switch (request.translatedState) {
      case MaintenanceRequestState.OPEN:
        return [MaintenanceAction.QUOTE];
      case MaintenanceRequestState.APPROVED:
        return [MaintenanceAction.REDIRECT, MaintenanceAction.DO_MAINTENANCE];
      case MaintenanceRequestState.REDIRECTED:
        return [MaintenanceAction.REDIRECT, MaintenanceAction.DO_MAINTENANCE];
      case MaintenanceRequestState.PAID:
        return [MaintenanceAction.COMPLETE];
      default:
        return [];
    }
  }
}
