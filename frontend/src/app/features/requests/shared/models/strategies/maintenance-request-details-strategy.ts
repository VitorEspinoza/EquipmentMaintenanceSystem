import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceAction } from '../maintenance-action/maintenance-action';
import { MaintenanceRequest } from '../maintenance-request';
import { IMaintenanceRequestService } from '../maintenance-request-service';

export interface MaintenanceRequestDetailsStrategy {
  requestService: IMaintenanceRequestService;
  getRequest(id: string): Observable<MaintenanceRequest>;
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[];
}

export const MAINTENANCE_REQUEST_DETAILS_STRATEGY = new InjectionToken<MaintenanceRequestDetailsStrategy>(
  'Strategy Token for Maintenance Requests'
);
