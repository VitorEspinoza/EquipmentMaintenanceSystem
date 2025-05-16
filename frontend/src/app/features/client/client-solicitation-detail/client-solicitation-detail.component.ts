import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Solicitation } from '../../../shared/models/solicitation';
import { SolicitationService } from '../../../shared/services/client-solicitation.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-client-service',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './client-solicitation-detail.component.html',
  styleUrls: ['./client-solicitation-detail.component.css'],
})
export class ClientSolicitationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private solicitationService = inject(SolicitationService);
  private router = inject(Router);

  requestId: string | null = null;
  requestData?: Solicitation;

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('idSolicitation');
    if (this.requestId) {
      this.loadRequestData(this.requestId);
    }
  }

  loadRequestData(id: string) {
    this.solicitationService.getSolicitationById(parseInt(id)).subscribe(data => {
      if (data) {
        this.requestData = data;
      } else {
        console.error('Solicitação não encontrada.');
        // Aqui você pode redirecionar, exibir uma mensagem, etc.
      }
    });
  }

  onApprove() {
    // lógica para aprovar
  }

  onReject() {
    // lógica para rejeitar
  }

  onRescue() {
    throw new Error('Method not implemented.');
  }

  onPayment() {
    if (!this.requestId) return;
    this.router.navigate(['/client/payment', this.requestId]);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ABERTA: 'bg-indigo-400 text-white',   
      ORÇADA: 'bg-yellow-800 text-white',
      REJEITADA: 'bg-red-600 text-white',
      APROVADA: 'bg-yellow-500 text-white',
      REDIRECIONADA: 'bg-purple-600 text-white',
      ARRUMADA: 'bg-blue-500 text-white',
      PAGA: 'bg-green-800 text-white',
      FINALIZADA: 'bg-green-600 text-white',
    };

    return map[status.toUpperCase()] || 'bg-gray-300 text-gray-800';
  }
}
