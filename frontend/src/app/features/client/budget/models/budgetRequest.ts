export interface BudgetRequest {
  id?: number; 
  dataHora?: string;
  equipamento: string;
  categoria?: string;
  cliente: string;
  defeito?: string;
  precoOrcado: number;
}
