import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataViewAction } from '../../../../shared/models/TableColumn';
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
export class EmployeeRequestListComponent {
  private readonly employeeStrategy = inject(REQUEST_LIST_STRATEGY);
  handleMenuAction = (action: string) => {
    this.employeeStrategy.handleToolbarAction({ action } as DataViewAction<string>);
  };
}
