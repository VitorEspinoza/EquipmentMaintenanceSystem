import { SolicitationHistory } from './solicitationHistory';

export interface Solicitation {
  redirectedTo: any;
  id: number;
  idClient: number;
  dateTime: string;
  equipment: string;
  status: string;
  budgetPrice: number;
  defectDescription: string;
  rejectionReason: string;
  history: SolicitationHistory[];
}
