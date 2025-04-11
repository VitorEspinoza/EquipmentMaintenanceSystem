import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent {
  @Input() solicitacao: {
    dataHora?: string;
    equipamento: string;
    categoria?: string;
    cliente: string;
    defeito?: string;
    precoOrcado: string | number;
  } = {
    dataHora: '',
    equipamento: '',
    categoria: '',
    cliente: '',
    defeito: '',
    precoOrcado: '',
  };

  @Input() observacoes: string = ''; // Observações pré-definidas como string vazia

  @Output() aprovar: EventEmitter<void> = new EventEmitter<void>();
  @Output() rejeitar: EventEmitter<void> = new EventEmitter<void>();

  onAprovar(): void {
    this.aprovar.emit();
  }

  onRejeitar(): void {
    this.rejeitar.emit();
  }
}
