import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SolicitationService } from '../../../shared/services/client-solicitation.service';
import { Solicitation } from '../../../shared/models/solicitation';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-client-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-payment.component.html',
  styleUrls: ['./client-payment.component.css'],
})
export class ClientPaymentComponent implements OnInit {
  private solicitationService = inject(SolicitationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  solicitation: Solicitation | undefined;
  paymentConfirmed = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitationService.getSolicitationById(id).subscribe(solicitation => {
      this.solicitation = solicitation;
    });
  }

  confirmPayment(): void {
    if (!this.solicitation) return;  // valida se há solicitação
  
    // Atualiza o histórico e status
    const now = new Date().toISOString();
    this.solicitation.history.push({
      id: Date.now(),
      previousState: this.solicitation.status,
      newState: 'PAGO',
      changeDate: now,
      updatedBy: 'Sistema',
      updatedByClient: true,
    });
  
    this.solicitation.status = 'PAGO';
  
    // Atualiza no backend
    this.solicitationService.updateSolicitation(this.solicitation).subscribe({
      next: () => {
        this.paymentConfirmed = true;              // ativa a mensagem de sucesso
        this.notificationService.success('Pagamento confirmado com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/client/solicitations']);  // redireciona depois de 1.5s
        }, 1500);
      },
      error: (err) => {
        console.error('Erro ao confirmar pagamento:', err);
        // Não altera paymentConfirmed nem mostra mensagem de erro para o usuário
      }
    });
  }
}