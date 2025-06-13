import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { combineLatest, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../../../../core/services/notification.service';

import {
  MAINTENANCE_REQUEST_STRATEGY,
  MaintenanceAction,
  MaintenanceRequestStrategy,
} from '../../models/maintenanceActionComponent';
import { RequestState } from '../../models/RequestState';
import { MaintenanceRequest } from './../../models/maintenanceRequest';

@Component({
  selector: 'app-base-maintenance-request-details',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './base-maintenance-request-details.component.html',
  styleUrl: './base-maintenance-request-details.component.css',
})
export class BaseMaintenanceRequestDetailsComponent {
  requestId = input.required<string>();
  private strategy: MaintenanceRequestStrategy = inject(MAINTENANCE_REQUEST_STRATEGY);
  private readonly notificationService = inject(NotificationService);
  private refreshTrigger = signal(0);

  requestLoaded = output<MaintenanceRequest | null>();

  request = toSignal(
    combineLatest([toObservable(this.requestId), toObservable(this.refreshTrigger)]).pipe(
      switchMap(([id]) => this.strategy.getRequest(id)),
      tap((request: MaintenanceRequest) => this.requestLoaded.emit(request))
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

    const map: Record<RequestState, string> = {
      [RequestState.OPEN]: 'bg-gray-500 text-white',
      [RequestState.QUOTED]: 'bg-yellow-800 text-white',
      [RequestState.REJECTED]: 'bg-red-600 text-white',
      [RequestState.APPROVED]: 'bg-yellow-500 text-white',
      [RequestState.REDIRECTED]: 'bg-purple-600 text-white',
      [RequestState.FIXED]: 'bg-blue-500 text-white',
      [RequestState.PAID]: 'bg-orange-500 text-white',
      [RequestState.COMPLETED]: 'bg-green-600 text-white',
    };

    return map[state] || defaultClass;
  });

  executeAction(action: MaintenanceAction) {
    this.strategy.requestService.executeAction(this.requestId(), action).subscribe({
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
