import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../features/client/shared/models/client';
import { Employee } from './employee';
import { EquipmentCategory } from './EquipmentCategory';
import { RequestHistory } from './requestHistory';
import { SolicitationState } from './SolicitationState';

export interface MaintenanceRequest {
  id: number;
  equipmentDescription: string;
  defectDescription: string;
  state: SolicitationState;
  createdAt: Date;
  equipmentCategory: EquipmentCategory;
  Client: Client;
  quotedValue: number;
  quotedAt: Date;
  quotedByEmployee: Employee;
  approvedAt: Date;
  rejectedAt: Date;
  rejectionReason: string;
  maintenanceDescription: string;
  customerGuidelines: string;
  maintenanceCompletedAt: Date;
  MaintenanceEmployee: Employee;
  paidAt: Date;
  finalizedAt: Date;
  finalizedByEmployee: Employee;
  assignToEmployee: Employee;
  stateHistory: RequestHistory[];
}

export interface MaintenanceInfo {
  maintenanceDescription: string;
  customerGuidelines: string;
}

export enum MaintenanceAction {
  APPROVE = 'Aprovar',
  REJECT = 'Rejeitar',
  QUOTE = 'Orçar',
  REDIRECT = 'Redirecionar',
  DO_MAINTENANCE = 'Realizar Manutenção',
  COMPLETE = 'Finalizar',
  RESCUE = 'Resgatar',
  PAY = 'Pagar',
}

export interface MaintenanceRequestStrategy {
  getRequest(id: string): Observable<MaintenanceRequest>;
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[];
  executeAction(requestId: string, action: MaintenanceAction): Observable<void>;
}

export const MAINTENANCE_REQUEST_STRATEGY = new InjectionToken<MaintenanceRequestStrategy>(
  'Strategy Token for Maintenance Requests'
);
