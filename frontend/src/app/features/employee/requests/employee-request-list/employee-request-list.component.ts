import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseMaintenanceRequestListComponent } from '../../../requests/shared/components/base-maintenance-request-list/base-maintenance-request-list.component';
import { REQUEST_LIST_STRATEGY } from '../../../requests/shared/models/strategies/maintenance-request-list.strategy';
import { EmployeeRequestListStrategy } from '../strategies/employee-maintenance-request-lists.strategy';
@Component({
  selector: 'app-employee-request-list',
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    BaseMaintenanceRequestListComponent,
    CommonModule,
  ],
  providers: [
    {
      provide: REQUEST_LIST_STRATEGY,
      useClass: EmployeeRequestListStrategy,
    },
  ],
  templateUrl: './employee-request-list.component.html',
  styleUrl: './employee-request-list.component.css',
})
export class EmployeeRequestListComponent {}
