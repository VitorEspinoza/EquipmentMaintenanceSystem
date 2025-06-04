import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MaintenanceRequest } from '../../../../shared/models/maintenanceRequest';
import { SolicitationState } from '../../../../shared/models/SolicitationState';
import { EmployeeRequestService } from '../../shared/services/employee-request.service';

const MATERIAL_MODULES = [MatTableModule];
const COMMON_MODULES = [CommonModule, NgIf, FormsModule];
const ROUTING_MODULES = [RouterModule];

@Component({
  selector: 'app-employee-request-list',
  imports: [...MATERIAL_MODULES, ...COMMON_MODULES, ...ROUTING_MODULES],
  templateUrl: './employee-request-list.component.html',
  styleUrl: './employee-request-list.component.css',
})
export class EmployeeRequestListComponent implements OnInit {
  private requestService: EmployeeRequestService = inject(EmployeeRequestService);

  solicitations: MaintenanceRequest[] = [];
  filterType: 'TODAS' | 'HOJE' | 'PERÍODO' = 'TODAS';
  solicitationState = SolicitationState;
  currentEmployee = 'Ian Bailone Almeida';

  ngOnInit(): void {
    this.requestService.getAll().subscribe((response: { data: MaintenanceRequest[] }) => {
      this.solicitations = response.data;
    });
  }

  getStatusClass(status: SolicitationState): string {
    switch (status) {
      case SolicitationState.OPEN:
        return 'bg-gray-300 text-black';
      case SolicitationState.QUOTED:
        return 'bg-amber-900 text-white';
      case SolicitationState.REJECTED:
        return 'bg-red-500 text-white';
      case SolicitationState.APPROVED:
        return 'bg-yellow-300 text-black';
      case SolicitationState.REDIRECTED:
        return 'bg-purple-400 text-white';
      case SolicitationState.FIXED:
        return 'bg-blue-400 text-white';
      case SolicitationState.PAID:
        return 'bg-orange-400 text-white';
      case SolicitationState.COMPLETED:
        return 'bg-green-400 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  }
}
