import { SolicitationState } from './SolicitationState';

export interface RequestHistory {
  id: number;
  state: SolicitationState;
  changedAt: Date;
  changedByEmployeeName: string;
}
