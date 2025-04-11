export interface BudgetRequest {
  dataHora?: string;
  equipamento: string;
  categoria?: string;
  cliente: string;
  defeito?: string;
  precoOrcado: number | string;
}
