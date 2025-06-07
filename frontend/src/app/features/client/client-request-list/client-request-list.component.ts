import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { MaintenanceRequest } from '../../../shared/models/maintenanceRequest';
import { SolicitationState } from '../../../shared/models/SolicitationState';
import { ClientRequestService } from '../shared/services/client-request.service';
import { MatButtonModule } from '@angular/material/button';

const MATERIAL_MODULES = [MatTableModule];
const COMMON_MODULES = [CommonModule, MatButtonModule];
const CORE_MODULES = [RouterModule];

@Component({
  selector: 'app-client-request-list',
  imports: [...MATERIAL_MODULES, ...CORE_MODULES, ...COMMON_MODULES],
  templateUrl: './client-request-list.component.html',
  styleUrls: ['./client-request-list.component.css'],
})
export class ClientRequestListComponent implements OnInit {
  private readonly solicitationService = inject(ClientRequestService);

  solicitations: MaintenanceRequest[] = [];

  ngOnInit(): void {
    this.solicitationService
      .getAll()
      .pipe(map(response => response.data))
      .subscribe(solicitations => {
        this.solicitations = solicitations;
      });
  }

  getStatusClass(state: SolicitationState): string {
    switch (state) {
      case SolicitationState.QUOTED:
        return 'bg-blue-100 text-blue-600';
      case SolicitationState.APPROVED:
        return 'bg-green-100 text-green-600';
      case SolicitationState.REJECTED:
        return 'bg-red-100 text-red-600';
      case SolicitationState.FIXED:
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  }

  getActionButton(solicitation: MaintenanceRequest): { label: string; route: string }[] | null {
    const defaultButton = { label: 'Visualizar Serviço', route: `/client/request/${solicitation.id}` };
    switch (solicitation.state) {
      case SolicitationState.QUOTED:
        return [{ ...defaultButton, label: 'Aprovar ou Rejeitar' }];
      case SolicitationState.REJECTED:
        return [{ label: 'Resgatar Serviço', route: '/resgatar' }];
      case SolicitationState.FIXED:
        return [{ label: 'Pagar Serviço', route: '/pagamento' }];
      default:
        return solicitation.state !== SolicitationState.APPROVED
          ? [{ label: 'Visualizar Serviço', route: `/client/request/${solicitation.id}` }]
          : [];
    }
  }
}
