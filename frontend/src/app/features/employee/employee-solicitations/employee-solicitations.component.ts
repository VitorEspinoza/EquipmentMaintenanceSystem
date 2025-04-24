import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SolicitationService } from '../../client/services/solicitation.service';
import { Solicitation } from '../../client/models/solicitation';

const MATERIAL_MODULES = [MatTableModule];
const COMMON_MODULES = [CommonModule, NgIf, FormsModule];
const ROUTING_MODULES = [RouterModule];

@Component({
  selector: 'app-employee-solicitations',
  imports: [...MATERIAL_MODULES, ...COMMON_MODULES, ...ROUTING_MODULES],
  templateUrl: './employee-solicitations.component.html',
  styleUrl: './employee-solicitations.component.css',
})
export class EmployeeSolicitationsComponent implements OnInit {
  private solicitationService = inject(SolicitationService);

  solicitations: Solicitation[] = [];
  filteredSolicitations: Solicitation[] = [];
  filterType: 'TODAS' | 'HOJE' | 'PERÍODO' = 'TODAS';
  dateStart: string = '';
  dateEnd: string = '';
  currentEmployee = 'Ian Bailone Almeida';

  ngOnInit(): void {
    this.solicitationService.getSolicitations().subscribe(solicitations => {
      this.solicitations = solicitations;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const today = new Date().toISOString().split('T')[0];

    this.filteredSolicitations = this.solicitations
      .filter(s => {
        if (s.status === 'REDIRECIONADA' && s.redirectedTo !== this.currentEmployee) return false;

        switch (this.filterType) {
          case 'HOJE':
            return s.dateTime.startsWith(today);
          case 'PERÍODO':
            return (!this.dateStart || s.dateTime >= this.dateStart) && (!this.dateEnd || s.dateTime <= this.dateEnd);
          default:
            return true;
        }
      })
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ABERTA':
        return 'bg-gray-300 text-black';
      case 'ORÇADA':
        return 'bg-amber-900 text-white';
      case 'REJEITADA':
        return 'bg-red-500 text-white';
      case 'APROVADA':
        return 'bg-yellow-300 text-black';
      case 'REDIRECIONADA':
        return 'bg-purple-400 text-white';
      case 'ARRUMADA':
        return 'bg-blue-400 text-white';
      case 'PAGA':
        return 'bg-orange-400 text-white';
      case 'FINALIZADA':
        return 'bg-green-400 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  }

  getActionButton(s: Solicitation): { label: string; route: string } | null {
    switch (s.status) {
      case 'ABERTA':
        return { label: 'Efetuar orçamento', route: '/orcamento/${s.id}' };
      case 'APROVADA':
      case 'REDIRECIONADA':
        return { label: 'Efetuar manutenção', route: '/manutencao/${s.id}' };
      case 'PAGA':
        return { label: 'Finalizar solicitação', route: '/finalizar/${s.id}' };
      default:
        return null;
    }
  }
}
