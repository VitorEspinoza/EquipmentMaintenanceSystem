import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, switchMap } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import {
  MAINTENANCE_REQUEST_STRATEGY,
  MaintenanceAction,
  MaintenanceRequestStrategy,
} from '../models/maintenanceRequest';
import { SolicitationState } from '../models/SolicitationState';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-maintenance-request-details',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatTableModule, MatDividerModule, MatIconModule],
  templateUrl: './maintenance-request-details.component.html',
  styleUrl: './maintenance-request-details.component.css',
})
export class MaintenanceRequestDetailsComponent {
  readonly displayedColumns: string[] = ['state', 'changedAt', 'changedByEmployeeName'];
  requestId = input.required<string>();
  private strategy: MaintenanceRequestStrategy = inject(MAINTENANCE_REQUEST_STRATEGY);
  private readonly notificationService = inject(NotificationService);
  private refreshTrigger = signal(0);

  request = toSignal(
    combineLatest([toObservable(this.requestId), toObservable(this.refreshTrigger)]).pipe(
      switchMap(([id]) => this.strategy.getRequest(id))
    ),
    { initialValue: null }
  );

  actions = computed(() => {
    const request = this.request();
    const actions = request ? this.strategy.getAvailableActions(request) : [];
    return actions;
  });

  stateClass = computed(() => {
    const defaultClass = 'bg-gray-300 text-gray-800';
    if (!this.request()) {
      return defaultClass;
    }
    const state = this.request()!.state;

    const map: Record<SolicitationState, string> = {
      [SolicitationState.OPEN]: 'bg-gray-500 text-white',
      [SolicitationState.QUOTED]: 'bg-yellow-800 text-white',
      [SolicitationState.REJECTED]: 'bg-red-600 text-white',
      [SolicitationState.APPROVED]: 'bg-yellow-500 text-white',
      [SolicitationState.REDIRECTED]: 'bg-purple-600 text-white',
      [SolicitationState.FIXED]: 'bg-blue-500 text-white',
      [SolicitationState.PAID]: 'bg-orange-500 text-white',
      [SolicitationState.COMPLETED]: 'bg-green-600 text-white',
    };

    return map[state] || defaultClass;
  });

  executeAction(action: MaintenanceAction) {
    this.strategy.executeAction(this.requestId(), action).subscribe({
      next: () => {
        this.notificationService.success(`Ação "${action}" executada com sucesso!`);
        this.refreshTrigger.update(value => value + 1);
      },
      error: () => {
        this.notificationService.error(`Não foi possível executar a ação de "${action}"`);
      },
    });
  }
}
