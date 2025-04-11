import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitationService } from '../../client/services/solicitation.service';
import { MatTableModule } from '@angular/material/table';
import { Solicitation } from '../../client/models/solicitation';

const MATERIAL_MODULES = [MatTableModule];
const COMMON_MODULES = [CommonModule, NgIf, FormsModule];
const ROUTING_MODULES = [RouterModule];

@Component({
  selector: 'app-employee-budget',
  imports: [...MATERIAL_MODULES, ...COMMON_MODULES, ...ROUTING_MODULES],
  templateUrl: './employee-budget.component.html',
  styleUrl: './employee-budget.component.css',
})
export class EmployeeBudgetComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitationService = inject(SolicitationService);

  solicitation: Solicitation | null = null;
  budgetValue: number | null = null;
  currentEmployee = 'Ian Bailone';
  dateTime = new Date();

  ngOnInit(): void {
    this.solicitation = {
      id: 99,
      equipment: 'Impressora HP LaserJet 1020',
      status: 'ABERTA',
      dateTime: '2024-04-10T10:30:00',
    };

    const solicitationId = Number(this.route.snapshot.paramMap.get('id'));

    this.solicitationService.getSolicitations().subscribe(solicitations => {
      this.solicitation = solicitations.find(s => s.id === solicitationId) || null;
    });
  }

  submitBudget(): void {
    if (!this.solicitation || this.budgetValue === null) return;

    const updatedSolicitation: Solicitation = {
      ...this.solicitation,
      status: 'ORÇADA',
      budgetValue: this.budgetValue,
      budgetedBy: this.currentEmployee,
      budgetedAt: this.dateTime.toISOString(),
    };

    this.solicitationService.updateSolicitation(updatedSolicitation).subscribe(() => {
      this.router.navigate(['/employee']);
    });
  }
}
