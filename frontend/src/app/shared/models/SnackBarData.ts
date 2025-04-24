export interface SnackBarData {
  tipo: 'APROVADO' | 'REJEITADO';
  mensagem?: string;
  preco?: number | string;
  redirectTo?: string;
  motivoRejeicao?: string;
}
