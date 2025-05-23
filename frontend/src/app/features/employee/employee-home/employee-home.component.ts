import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { Solicitation } from '../../../shared/models/solicitation';
import { SolicitationService } from '../../../shared/services/client-solicitation.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

const MATERIAL_MODULES = [MatTableModule, MatTableModule, MatButtonModule, MatCardModule];
const COMMON_MODULES = [CommonModule];
const CORE_MODULES = [RouterModule];

@Component({
  selector: 'app-employee-home',
  imports: [...MATERIAL_MODULES, ...CORE_MODULES, ...COMMON_MODULES],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css',
})
export class EmployeeHomeComponent implements OnInit {
  private readonly solicitationService = inject(SolicitationService);

  displayedColumns: string[] = ['dateTime', 'equipment', 'action'];
  solicitations: Solicitation[] = [];

  ngOnInit(): void {
    this.getSolicitations();
  }

  getSolicitations() {
    this.solicitationService
      .getSolicitations()
      .pipe(map(solicitations => solicitations.filter(s => s.status === 'ABERTA')))
      .subscribe(solicitations => (this.solicitations = solicitations));
  }
  getTruncatedDescription(equipment: string): string {
    return equipment.length > 30 ? equipment.substring(0, 30) + '...' : equipment;
  }

  getActionButton(solicitation: Solicitation): { label: string; route: string }[] | null {
    return solicitation.status === 'ABERTA'
      ? [{ label: 'Efetuar Orçamento', route: `/employee/budget/${solicitation.id}` }]
      : null;
  }
}
