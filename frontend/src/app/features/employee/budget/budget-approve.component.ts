import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BudgetRequest} from './models/budgetRequest';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-budget-approve.component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './budget-approve.component.html',
  styleUrls: ['./budget-approve.component.css']
})

export class BudgetApproveComponent {
  @Input() solicitacao: BudgetRequest = {
  dataHora: '',
  equipamento: '',
  categoria: '',
  cliente: '',
  defeito: '',
  precoOrcado: '',
};

constructor() {
  console.log('Componente carregado!');
}

  @Input() observacoes: string = '';

  @Output() aprovar: EventEmitter<void> = new EventEmitter<void>();
  @Output() rejeitar: EventEmitter<void> = new EventEmitter<void>();

  onAprovar(): void {
    this.aprovar.emit();
  }

  onRejeitar(): void {
    this.rejeitar.emit();
  }
}
