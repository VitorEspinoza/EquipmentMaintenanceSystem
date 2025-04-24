export interface EmployeeSolicitation {
  id: number;
  idClient: number;
  state: string;
  redirectedTo: any;
  dateTime: string;
  equipment: string;
  budgetPrice: number;
  defectDescription: string;
  rejectionReason: string;
}
