import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitationService } from '../../../shared/services/client-solicitation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PerformMaintenaceModalComponent } from './perform-maintenance-modal/perform-maintenance-modal.component';
import { Solicitation } from '../../../shared/models/solicitation';

@Component({
  selector: 'app-employee-maintenance',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './employee-maintenance.component.html',
  styleUrl: './employee-maintenance.component.css',
})
export class EmployeeMaintenanceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly solicitationService = inject(SolicitationService);
  private readonly notificationsService = inject(NotificationService);

  solicitation!: Solicitation;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Id da rota', id);
    this.solicitationService.getSolicitationById(id).subscribe(s => {
      console.log('Solicitação recebida', s);
      if (s) this.solicitation = s;
    });
  }

  performMaintenace(): void {
    const dialogRef = this.dialog.open(PerformMaintenaceModalComponent, { data: {} });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || !this.solicitation) return;

      this.solicitation.status = 'ARRUMADA';

      this.solicitation.history.push({
        id: Date.now(),
        previousState: this.solicitation.status,
        newState: 'ARRUMADA',
        changeDate: new Date().toISOString(),
        updatedByClient: false,
        updatedBy: 'Ian Bailone',
      });

      this.solicitationService.updateSolicitation(this.solicitation).subscribe(() => {
        this.notificationsService.success('Manutenção registrada com sucesso! ');
        this.router.navigate(['solicitations']);
      });
    });
  }

  redirectMaintenace(): void {
    this.router.navigate(['/redirect/${this.solicitation?.id}']);
  }
}
