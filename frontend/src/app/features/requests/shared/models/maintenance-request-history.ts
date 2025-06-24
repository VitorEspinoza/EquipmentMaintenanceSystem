import { MaintenanceRequestState } from './maintenance-request-state';

export interface MaintenanceRequestHistory {
  id: number;
  state: MaintenanceRequestState;
  changedAt: Date;
  changedByEmployeeName: string;
}
