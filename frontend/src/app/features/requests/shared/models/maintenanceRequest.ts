import { Employee } from '../../../../shared/models/employee';
import { EquipmentCategory } from '../../../../shared/models/EquipmentCategory';
import { Client } from '../../../client/shared/models/client';
import { RequestHistory } from './requestHistory';
import { RequestState } from './RequestState';

export interface MaintenanceRequest {
  id: number;
  equipmentDescription: string;
  defectDescription: string;
  state: RequestState;
  translatedState: string;
  createdAt: Date;
  equipmentCategory: EquipmentCategory;
  client: Client;
  quotedValue: number;
  quotedAt: Date;
  quotedByEmployee: Employee;
  approvedAt: Date;
  rejectedAt: Date;
  rejectionReason: string;
  maintenanceDescription: string;
  customerGuidelines: string;
  maintenanceCompletedAt: Date;
  maintenanceEmployee: Employee;
  paidAt: Date;
  finalizedAt: Date;
  finalizedByEmployee: Employee;
  assignToEmployee: Employee;
  stateHistory: RequestHistory[];
}
