import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CrudService } from '../../core/services/crud.service';
import { Solicitation } from '../models/solicitation';

@Injectable({
  providedIn: 'root',
})
export class SolicitationService {
  private crudService = inject(CrudService);
  authPrefix = 'solicitaion';

  private solicitations: Solicitation[] = [
    {
      id: 1,
      idClient: 1,
      dateTime: '2024-03-30T14:00:00',
      equipment: 'Impressora HP LaserJet',
      status: 'ORÇADA',
      budgetPrice: 100,
      defectDescription: 'Impressora não liga',
      rejectionReason: '',
      redirectedTo: 'Ian Bailone Almeida',
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
      id: 2,
      idClient: 1,
      dateTime: '2024-03-30T14:00:00',
      equipment: 'Monitor Dell',
      status: 'ABERTA',
      budgetPrice: 398,
      defectDescription: 'Monitor não liga',
      rejectionReason: '',
      redirectedTo: null,
      history: [],
    },
    {
      id: 3,
      idClient: 1,
      dateTime: '2024-03-29T10:30:00',
      equipment: 'Notebook Dell Inspiron',
      status: 'APROVADA',
      budgetPrice: 300,
      defectDescription: 'Tela piscando aleatoriamente',
      rejectionReason: '',
      redirectedTo: 'Ian Bailone Almeida',
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
      id: 4,
      idClient: 1,
      dateTime: '2024-03-28T16:45:00',
      equipment: 'Monitor Samsung',
      status: 'REJEITADA',
      budgetPrice: 500,
      defectDescription: 'Imagem distorcida',
      rejectionReason: 'Valor do conserto acima do esperado pelo cliente',
      redirectedTo: 'Ian Bailone Almeida',
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
    {
      id: 5,
      idClient: 1,
      dateTime: '2024-03-30T14:00:00',
      equipment: 'Controle XBOX',
      status: 'ABERTA',
      budgetPrice: 350,
      defectDescription: 'Demora a responder no analógico',
      rejectionReason: '',
      redirectedTo: null,
      history: [],
    },
    {
      id: 6,
      idClient: 1,
      dateTime: '2024-05-15T11:00:00',
      equipment: 'Teclado Mecânico',
      status: 'ARRUMADA',
      budgetPrice: 250,
      defectDescription: 'Teclas com resposta lenta',
      rejectionReason: '',
      redirectedTo: null,
      history: [
        {
          id: 6,
          previousState: 'ORÇADA',
          newState: 'ARRUMADA',
          changeDate: '2024-05-14T09:30:00',
          updatedBy: 'Gusttavo Lima',
          updatedByClient: false,
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

  isReadyForPayment(solicitation: Solicitation): boolean {
    return solicitation.status === 'ARRUMADA';
  }
  
}
