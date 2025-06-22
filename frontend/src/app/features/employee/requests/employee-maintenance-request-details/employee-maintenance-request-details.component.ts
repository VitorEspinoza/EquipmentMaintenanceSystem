import { Component, input, signal } from '@angular/core';
import { BaseMaintenanceRequestDetailsComponent } from '../../../requests/shared/components/base-maintenance-request-details/base-maintenance-request-details.component';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenance-request';

@Component({
  selector: 'app-employee-maintenance-request-details',
  imports: [BaseMaintenanceRequestDetailsComponent],
  templateUrl: './employee-maintenance-request-details.component.html',
  styleUrl: './employee-maintenance-request-details.component.css',
})
export class EmployeeMaintenanceRequestDetailsComponent {
  readonly requestId = input.required<string>();

  readonly request = signal<MaintenanceRequest | null>(null);

  onRequestLoaded = (data: MaintenanceRequest | null) => {
    this.request.set(data);
  };
}
