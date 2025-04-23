import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { CustomSnackBarService } from '../../../shared/services/services/custom-snack-bar.service';
import { BudgetRequest } from './models/budgetRequest';

@Component({
  selector: 'app-budget-approve.component',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './budget-approve.component.html',
  styleUrls: ['./budget-approve.component.css'],
})
export class BudgetApproveComponent {
  private readonly router = inject(Router);
  private readonly snackBar = inject(CustomSnackBarService);

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

  aprovarServico() {
    this.snackBar.show({
      tipo: 'APROVADO',
      preco: this.solicitacao.precoOrcado,
      mensagem: 'Serviço aprovado no valor de',
      redirectTo: '/client-home',
    });
  }

  rejeitarServico() {
    this.snackBar.show({
      tipo: 'REJEITADO',
      mensagem: 'Serviço reprovado!',
      redirectTo: '/client-home',
    });
  }

  @Input() observacoes: string = '';

  @Output() rejeitar: EventEmitter<void> = new EventEmitter<void>();

  onRejeitar(): void {
    this.rejeitar.emit();
  }
}
