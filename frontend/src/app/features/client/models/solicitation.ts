export interface Solicitation {
  id: number;
  dateTime: string;
  equipment: string;
  status: string;
  budgetValue?: number;
  budgetedBy?: string;
  budgetedAt?: string;
}
