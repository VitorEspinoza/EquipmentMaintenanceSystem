import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitationService } from '../services/solicitation.service';
import { Solicitation } from '../models/solicitation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-service',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './client-solicitation.component.html',
  styleUrls: ['./client-solicitation.component.css'],
})
export class ClientSolicitationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private solicitationService = inject(SolicitationService);

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

  onSendToNextStep() {
    // lógica para avançar
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ABERTA: 'bg-gray-500 text-white',
      ORÇADA: 'bg-yellow-800 text-white',
      REJEITADA: 'bg-red-600 text-white',
      APROVADA: 'bg-yellow-500 text-white',
      REDIRECIONADA: 'bg-purple-600 text-white',
      ARRUMADA: 'bg-blue-500 text-white',
      PAGA: 'bg-orange-500 text-white',
      FINALIZADA: 'bg-green-600 text-white',
    };

    return map[status.toUpperCase()] || 'bg-gray-300 text-gray-800';
  }
}
