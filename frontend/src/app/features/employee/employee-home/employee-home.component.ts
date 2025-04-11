import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Solicitation } from '../../client/models/solicitation';
import { SolicitationService } from '../../client/services/solicitation.service';

const MATERIAL_MODULES = [MatTableModule];
const COMMON_MODULES = [NgIf, CommonModule];
const CORE_MODULES = [RouterModule];

@Component({
  selector: 'app-employee-home',
  imports: [...MATERIAL_MODULES, ...CORE_MODULES, ...COMMON_MODULES],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css',
})
export class EmployeeHomeComponent implements OnInit {
  private readonly solicitationService = inject(SolicitationService);

  solicitations: Solicitation[] = [];

  ngOnInit(): void {
    this.solicitations = [
      {
        dateTime: '2024-03-31T09:00:00',
        equipment: 'Impressora Epson',
        status: 'ABERTA',
        id: 1,
      },
      {
        dateTime: '2024-03-30T14:30:00',
        equipment: 'Monitor LG',
        status: 'ABERTA',
        id: 2,
      },
      {
        dateTime: '2024-03-28T11:45:00',
        equipment: 'Notebook Lenovo',
        status: 'FECHADA',
        id: 3,
      },
    ].filter(s => s.status === 'ABERTA');
  }

  getTruncatedDescription(equipment: string): string {
    return equipment.length > 30 ? equipment.substring(0, 30) + '...' : equipment;
  }

  getActionButton(status: string): { label: string; route: string }[] | null {
    return status === 'ABERTA' ? [{ label: 'Efetuar Orçamento', route: '/orcamento' }] : null;
  }
}
