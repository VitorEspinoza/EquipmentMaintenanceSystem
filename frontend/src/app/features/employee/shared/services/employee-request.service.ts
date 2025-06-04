import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../../../shared/models/DefaultResponse';
import { MaintenanceInfo, MaintenanceRequest } from '../../../../shared/models/maintenanceRequest';
import { CrudService } from './../../../../core/services/crud.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeRequestService {
  private readonly crudService = inject(CrudService);

  private endpoint = 'employee/maintenance-request';

  getAll(): Observable<DefaultResponse<MaintenanceRequest[]>> {
    return this.crudService.get<DefaultResponse<MaintenanceRequest[]>>(this.endpoint);
  }

  getById(id: string): Observable<DefaultResponse<MaintenanceRequest>> {
    return this.crudService.get<DefaultResponse<MaintenanceRequest>>(`${this.endpoint}/${id}`);
  }

  finalize(id: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/approve`, {});
  }

  quote(id: string, price: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/quote`, { price });
  }

  redirect(id: string, newEmployeeId: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/redirect/?newEmployeeId=${newEmployeeId}`, {});
  }

  doMaintenence(id: string, maintenanceInfo: MaintenanceInfo): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/do-maintenance`, {
      ...maintenanceInfo,
    });
  }
}
