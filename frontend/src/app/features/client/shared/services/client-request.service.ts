import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../../../core/services/crud.service';
import { DefaultResponse } from '../../../../shared/models/DefaultResponse';
import { MaintenanceRequest } from '../../../../shared/models/maintenanceRequest';

@Injectable({
  providedIn: 'root',
})
export class ClientRequestService {
  private crudService = inject(CrudService);
  endpoint = 'client/maintenance-request';

  getAll(): Observable<DefaultResponse<MaintenanceRequest[]>> {
    return this.crudService.get<DefaultResponse<MaintenanceRequest[]>>(this.endpoint);
  }

  getById(id: string): Observable<DefaultResponse<MaintenanceRequest>> {
    return this.crudService.get<DefaultResponse<MaintenanceRequest>>(`${this.endpoint}/${id}`);
  }

  approve(id: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/approve`, {});
  }

  reject(id: string, reason: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/reject`, { reason });
  }

  pay(id: string): Observable<void> {
    return this.crudService.post<void>(`${this.endpoint}/${id}/pay`, {});
  }
}
