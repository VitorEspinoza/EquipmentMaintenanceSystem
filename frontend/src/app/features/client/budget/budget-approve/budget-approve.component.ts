import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { BudgetService } from '../services/budget.service';
import { BudgetRequest } from '../models/budgetRequest';
import { BudgetRejectionModalComponent } from '../shared/components/budget-rejection-modal/budget-rejection-modal.component';

@Component({
  selector: 'app-budget-approve',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './budget-approve.component.html',
  styleUrls: ['./budget-approve.component.css'],
})
export class BudgetApproveComponent {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly budgetService = inject(BudgetService);

  @Input() budgetRequest: BudgetRequest = {
    id: 1,
    dataHora: '11/04/2025 10:45',
    equipamento: 'Notebook Dell Inspiron 15',
    categoria: 'Notebook',
    cliente: 'Fulano de Tal',
    defeito: 'Não liga.',
    precoOrcado: 735.90,
  };

  @Input() observations: string = 'Cliente informou defeito na placa-mãe.';

  @Output() reject: EventEmitter<void> = new EventEmitter<void>();
  @Output() approve: EventEmitter<number> = new EventEmitter<number>();

  loadingApprove: boolean = false;
  loadingReject: boolean = false;

  // Guarda logs locais para auditoria temporária (exemplo)
  private localAuditLogs: string[] = [];

  onApprove(): void {
    if (!this.budgetRequest.id) {
      this.notificationService.error('Request ID not found.');
      this.logAudit('Falha na aprovação: ID inválido');
      return;
    }

    if (this.loadingApprove) {
      return; // evita chamadas repetidas simultâneas
    }

    this.loadingApprove = true;
    this.logAudit(`Tentativa de aprovação para orçamento ID ${this.budgetRequest.id}`);

    this.budgetService.approveBudget(this.budgetRequest.id).subscribe({
      next: (response) => {
        this.loadingApprove = false;
        this.logAudit(`Orçamento ID ${this.budgetRequest.id} aprovado com sucesso`);
        this.notificationService.success(`Serviço aprovado no valor de R$ ${this.formatPrice(this.budgetRequest.precoOrcado)}`);
        this.approve.emit(this.budgetRequest.id);
        this.router.navigate(['/some-route']);
      },
      error: (err) => {
        this.loadingApprove = false;
        this.logAudit(`Erro na aprovação do orçamento ID ${this.budgetRequest.id}: ${err.message}`);
        this.notificationService.error('Erro ao aprovar o orçamento. Tente novamente.');
      }
    });
  }

  onReject(): void {
    if (this.loadingReject) return;

    this.loadingReject = true;
    this.logAudit(`Abrindo modal de rejeição para orçamento ID ${this.budgetRequest.id}`);

    this.dialog.open(BudgetRejectionModalComponent, { data: { budgetId: this.budgetRequest.id } })
      .afterClosed()
      .subscribe((response: any) => {
        this.loadingReject = false;

        if (!response) {
          this.notificationService.info('Rejeição cancelada.');
          this.logAudit(`Rejeição cancelada para orçamento ID ${this.budgetRequest.id}`);
          return;
        }

        this.logAudit(`Orçamento ID ${this.budgetRequest.id} rejeitado com motivo: ${response.reason || 'sem motivo informado'}`);

        // Aqui poderia enviar a rejeição ao backend com o motivo
        this.reject.emit();
        this.notificationService.info('Este orçamento foi rejeitado!');
      }, (err) => {
        this.loadingReject = false;
        this.logAudit(`Erro ao tentar rejeitar orçamento ID ${this.budgetRequest.id}: ${err.message}`);
        this.notificationService.error('Erro ao tentar rejeitar o orçamento.');
      });
  }

  onRejectEvent(): void {
    this.reject.emit();
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Método para logs locais, pode ser expandido para armazenar em localStorage ou enviar a servidor
  private logAudit(message: string): void {
    const timestamp = new Date().toISOString();
    this.localAuditLogs.push(`[${timestamp}] ${message}`);
    console.log(`[Audit Log] ${timestamp}: ${message}`);
  }

  // Função para obter logs (útil para debug)
  getAuditLogs(): string[] {
    return this.localAuditLogs;
  }
}
