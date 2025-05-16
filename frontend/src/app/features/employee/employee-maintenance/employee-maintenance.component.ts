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
import { RedirectMaintenanceModalComponent } from './redirect-maintenance-modal/rediect-maintenance-modal/redirect-maintenance-modal.component';

@Component({
  selector: 'app-employee-maintenance',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './employee-maintenance.component.html',
  styleUrl: './employee-maintenance.component.css',
})
export class EmployeeMaintenanceComponent implements OnInit {
  solicitation!: Solicitation;
  readonly employees: ['Ian Bailone Almeida', 'Gabriel Veiga', 'Vitor Espinoza'] | undefined;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly solicitationService = inject(SolicitationService);
  private readonly notificationsService = inject(NotificationService);
  loggedInEmployee: string | undefined;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitationService.getSolicitationById(id).subscribe(s => {
      if (s) this.solicitation = s;
    });
  }

  redirectMaintenace(): void {
    const dialogRef = this.dialog.open(RedirectMaintenanceModalComponent);

    dialogRef.afterClosed().subscribe((selectedEmployee: string | undefined) => {
      if (selectedEmployee) {
        this.notificationsService.success('Serviço redirecionado para ....');
      } else {
        this.notificationsService.info('Redirecionamento cancelado!');
      }
    });
  }

  performMaintenace(): void {
    const dialogRef = this.dialog.open(PerformMaintenaceModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationsService.success('Manutenção realizada com sucesso!');
      } else {
        this.notificationsService.info('Manutenção cancelada');
      }
    });
  }
}
