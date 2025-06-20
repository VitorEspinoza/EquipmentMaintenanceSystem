import { RequestState } from './RequestState';

export interface RequestHistory {
  id: number;
  state: RequestState;
  changedAt: Date;
  changedByEmployeeName: string;
}
