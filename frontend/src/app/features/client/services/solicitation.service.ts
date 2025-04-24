import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { Solicitation } from '../models/solicitation';

@Injectable({
  providedIn: 'root',
})
export class SolicitationService {
  private crudService = inject(CrudService);
  authPrefix = 'solicitaion';

  private solicitations: Solicitation[] = [
    {
      id: 0,
      idClient: 1,
      dateTime: '2024-03-30T14:00:00',
      equipment: 'Impressora HP LaserJet',
      status: 'ORÇADA',
      budgetPrice: 100,
      defectDescription: 'Impressora não liga',
      rejectionReason: '',
      history: [
        {
          id: 1,
          previousState: 'ABERTA',
          newState: 'ORÇADA',
          changeDate: '2024-03-30T14:00:00',
          updatedBy: 'Igor Guilherme Santos',
          updatedByClient: false,
        },
      ],
    },
    {
      id: 1,
      idClient: 1,
      dateTime: '2024-03-29T10:30:00',
      equipment: 'Notebook Dell Inspiron',
      status: 'APROVADA',
      budgetPrice: 300,
      defectDescription: 'Tela piscando aleatoriamente',
      rejectionReason: '',
      history: [
        {
          id: 2,
          previousState: 'ABERTA',
          newState: 'ORÇADA',
          changeDate: '2024-03-28T09:00:00',
          updatedBy: 'Bruno Henrique',
          updatedByClient: false,
        },
        {
          id: 3,
          previousState: 'ORÇADA',
          newState: 'APROVADA',
          changeDate: '2024-03-29T10:30:00',
          updatedBy: 'Lionel Messi',
          updatedByClient: true,
        },
      ],
    },
    {
      id: 2,
      idClient: 1,
      dateTime: '2024-03-28T16:45:00',
      equipment: 'Monitor Samsung',
      status: 'REJEITADA',
      budgetPrice: 500,
      defectDescription: 'Imagem distorcida',
      rejectionReason: 'Valor do conserto acima do esperado pelo cliente',
      history: [
        {
          id: 4,
          previousState: 'ABERTA',
          newState: 'ORÇADA',
          changeDate: '2024-03-27T15:00:00',
          updatedBy: 'Bruno Henrique',
          updatedByClient: false,
        },
        {
          id: 5,
          previousState: 'ORÇADA',
          newState: 'REJEITADA',
          changeDate: '2024-03-28T16:45:00',
          updatedBy: 'Lionel Messi',
          updatedByClient: true,
        },
      ],
    },
  ];

  getSolicitations(): Observable<Solicitation[]> {
    return of(this.solicitations);
  }

  getSolicitationById(id: number): Observable<Solicitation | undefined> {
    const solicitation = this.solicitations.find(s => s.id === id);
    return of(solicitation);
  }

  updateSolicitation(solicitation: Solicitation): Observable<void> {
    return this.crudService.put<void>(`${this.authPrefix}/${solicitation.id}`, solicitation);
  }
}
