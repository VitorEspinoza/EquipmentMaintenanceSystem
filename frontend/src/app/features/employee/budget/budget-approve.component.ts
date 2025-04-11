import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
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

  @Input() solicitacao: BudgetRequest = {
    dataHora: '',
    equipamento: '',
    categoria: '',
    cliente: '',
    defeito: '',
    precoOrcado: '',
  };

  constructor(private snackBar: MatSnackBar) {
    console.log('Componente carregado!');
  }

  @Input() observacoes: string = '';

  aprovarServico(): void {
    const snack = this.snackBar.open(`Serviço aprovado no Valor de R% ${this.solicitacao.precoOrcado}`, 'ok', {
      duration: 0,
      panelClass: ['snackbar'],
    });

    snack.onAction().subscribe(() => {
      this.router.navigate(['/client-home']);
    });
  }

  @Output() rejeitar: EventEmitter<void> = new EventEmitter<void>();

  onRejeitar(): void {
    this.rejeitar.emit();
  }
}
