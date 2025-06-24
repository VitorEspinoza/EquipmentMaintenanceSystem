import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../../../shared/models/DefaultResponse';
import { MaintenanceAction } from './maintenance-action/maintenance-action';
import { MaintenanceRequest } from './maintenance-request';

export interface IMaintenanceRequestService {
  getAll(params?: HttpParams): Observable<DefaultResponse<MaintenanceRequest[]>>;
  getById(id: string): Observable<DefaultResponse<MaintenanceRequest>>;
  executeAction(requestId: string, action: MaintenanceAction): Observable<void>;
}
