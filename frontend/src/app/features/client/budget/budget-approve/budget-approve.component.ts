import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { BudgetRequest } from '../models/budgetRequest';
import { BudgetRejectionModalComponent } from '../shared/components/budget-rejection-modal/budget-rejection-modal.component';

@Component({
  selector: 'app-budget-approve.component',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './budget-approve.component.html',
  styleUrls: ['./budget-approve.component.css'],
})
export class BudgetApproveComponent {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  @Input() solicitacao: BudgetRequest = {
    dataHora: '',
    equipamento: '',
    categoria: '',
    cliente: '',
    defeito: '',
    precoOrcado: '',
  };

  approve() {
    this.notificationService.success(`Serviço aprovado no valor de R$ 735,90`);
  }

  reject() {
    this.dialog
      .open(BudgetRejectionModalComponent, { data: {} })
      .afterClosed()
      .subscribe((response: any) => {
        if (!response) return;
        console.log('motivo: ', response);
        this.notificationService.info('Este orçamento foi recusado!');
      });
  }

  @Input() observacoes: string = '';

  @Output() rejeitar: EventEmitter<void> = new EventEmitter<void>();

  onRejeitar(): void {
    this.rejeitar.emit();
  }
}
