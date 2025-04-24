import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { Solicitation } from '../../../shared/models/solicitation';
import { SolicitationService } from '../../../shared/services/client-solicitation.service';

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
  private readonly notificationService = inject(NotificationService);

  solicitation: Solicitation | null = null;
  budgetValue: number | null = null;
  currentEmployee = 'Ian Bailone';
  dateTime = new Date();

  ngOnInit(): void {
    const solicitationId = Number(this.route.snapshot.paramMap.get('solicitationId'));
    this.getSolicitation(solicitationId);
  }

  getSolicitation(id: number) {
    this.solicitationService.getSolicitationById(id).subscribe({
      next: solicitation => {
        if (!solicitation)
          return this.notificationService.warning(`A solicitação com id: ${id} não existe`, 'Não encontrada');
        this.solicitation = solicitation;
      },
    });
  }

  submitBudget(): void {
    if (!this.solicitation || this.budgetValue === null) return;

    const updatedSolicitation: Solicitation = {
      ...this.solicitation,
      status: 'ORÇADA',
      budgetPrice: this.budgetValue,
    };

    this.solicitationService.updateSolicitation(updatedSolicitation).subscribe(() => {
      this.router.navigate(['/employee-home']);
    });
  }
}
