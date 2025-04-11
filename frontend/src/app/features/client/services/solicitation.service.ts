import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { Solicitation } from '../models/solicitation';

@Injectable({
  providedIn: 'root',
})
export class SolicitationService {
  private crudService = inject(CrudService);
  authPrefix = 'solicitaion';

  getSolicitations(): Observable<Solicitation[]> {
    return this.crudService.get<Solicitation[]>(this.authPrefix);
  }

  updateSolicitation(solicitation: Solicitation): Observable<void> {
    return this.crudService.put<void>(`${this.authPrefix}/${solicitation.id}`, solicitation);
  }
}
