import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../../../../core/services/notification.service';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { DynamicTableComponent } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { TableColumn } from '../../../../../shared/models/TableColumn';
import {
  MAINTENANCE_REQUEST_STRATEGY,
  MaintenanceAction,
  MaintenanceRequestStrategy,
} from '../../models/maintenanceActionComponent';
import { RequestState } from '../../models/RequestState';
import { MaintenanceRequest } from './../../models/maintenanceRequest';
@Component({
  selector: 'app-base-maintenance-request-details',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    CdkAccordionModule,
    MatExpansionModule,
    DynamicTableComponent,
  ],
  templateUrl: './base-maintenance-request-details.component.html',
  styleUrl: './base-maintenance-request-details.component.css',
})
export class BaseMaintenanceRequestDetailsComponent {
  requestId = input.required<string>();
  private strategy: MaintenanceRequestStrategy = inject(MAINTENANCE_REQUEST_STRATEGY);
  private readonly notificationService = inject(NotificationService);
  private refreshTrigger = signal(0);

  historyTableColumns = signal<TableColumn[]>([
    {
      key: 'translatedState',
      header: 'Status',
      type: 'text',
    },
    {
      key: 'changedAt',
      header: 'Data de Alteração',
      type: 'date',
      dateFormat: 'dd/MM/yyyy HH:mm',
    },
    {
      key: 'changedByEmployeeName',
      defaultValue: 'N / A',
      header: 'Funcionário Responsável',
      type: 'text',
      slice: { start: 0, end: 30 },
    },
  ]);
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

  successMessage = (action: MaintenanceAction): string => {
    switch (action) {
      case MaintenanceAction.APPROVE: {
        return `Serviço Aprovado no Valor de R$ ${this.request()!.quotedValue}`;
      }
      case MaintenanceAction.REJECT:
        return 'Serviço rejeitado';
      case MaintenanceAction.RESCUE:
        return 'Serviço resgatado';
      default:
        return `Ação "${action}" executada com sucesso!`;
    }
  };

  executeAction(action: MaintenanceAction) {
    this.strategy.requestService.executeAction(this.requestId(), action).subscribe({
      next: () => {
        this.notificationService.success(this.successMessage(action));
        this.refreshTrigger.update(value => value + 1);
      },
      error: () => {
        this.notificationService.error(`Não foi possível executar a ação de "${action}"`);
      },
    });
  }
}
