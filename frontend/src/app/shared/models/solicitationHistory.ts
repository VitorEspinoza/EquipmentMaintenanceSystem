export interface SolicitationHistory {
  id: number;
  previousState: string;
  newState: string;
  changeDate: string;
  updatedByClient: boolean;
  updatedBy: string;
}
