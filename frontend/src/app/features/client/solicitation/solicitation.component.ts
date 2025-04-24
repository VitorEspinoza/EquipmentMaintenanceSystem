import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Solicitation } from '../models/solicitation';
import { SolicitationService } from '../services/solicitation.service';

const MATERIAL_MODULES = [MatTableModule];
const COMMON_MODULES = [NgIf, CommonModule];
const CORE_MODULES = [RouterModule];

@Component({
  selector: 'app-client-home',
  imports: [...MATERIAL_MODULES, ...CORE_MODULES, ...COMMON_MODULES],
  templateUrl: './solicitation.component.html',
  styleUrls: ['./solicitation.component.css'],
})
export class ClientHomeComponent implements OnInit {
  private readonly solicitationService = inject(SolicitationService);

  solicitations: Solicitation[] = [];

  ngOnInit(): void {
    this.solicitationService.getSolicitations().subscribe(data => {
      this.solicitations = data;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ORÇADA':
        return 'bg-blue-100 text-blue-600';
      case 'APROVADA':
        return 'bg-green-100 text-green-600';
      case 'REJEITADA':
        return 'bg-red-100 text-red-600';
      case 'ARRUMADA':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  }

  getActionButton(status: string): { label: string; route: string }[] | null {
    switch (status) {
      case 'ORÇADA':
        return [{ label: 'Aprovar/Rejeitar', route: '/orcamento' }];
      case 'REJEITADA':
        return [{ label: 'Resgatar Serviço', route: '/resgatar' }];
      case 'ARRUMADA':
        return [{ label: 'Pagar Serviço', route: '/pagamento' }];
      default:
        return status !== 'APROVADA' ? [{ label: 'Visualizar Serviço', route: '/visualizar' }] : [];
    }
  }
}
