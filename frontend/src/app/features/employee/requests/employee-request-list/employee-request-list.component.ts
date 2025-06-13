import { HttpParams } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { RequestState } from './../../../requests/shared/models/RequestState';

import { map, startWith, switchMap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { DataListViewComponent } from '../../../../shared/components/data-list-view/data-list-view.component';
import { DynamicTableComponent } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { DataViewAction, TableAction, TableColumn } from '../../../../shared/models/TableColumn';
import { FilterRequestsModalComponent } from '../../../requests/shared/modals/filter-requests-modal/filter-requests-modal.component';
import { MaintenanceAction } from '../../../requests/shared/models/maintenanceActionComponent';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenanceRequest';
import { EmployeeRequestService } from '../../services/employee-request.service';

const SMART_COMPONENTS = [DataListViewComponent, DynamicTableComponent];

@Component({
  selector: 'app-employee-request-list',
  imports: [...SMART_COMPONENTS],
  templateUrl: './employee-request-list.component.html',
  styleUrl: './employee-request-list.component.css',
})
export class EmployeeRequestListComponent {
  private requestService: EmployeeRequestService = inject(EmployeeRequestService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  private readonly filtersSignal = signal<HttpParams>(new HttpParams().set('state', 'OPEN'));
  private readonly manualRefresh = signal(0);

  readonly requestTrigger = computed(() => ({
    params: this.filtersSignal(),
    refreshTick: this.manualRefresh(),
  }));

  readonly requests = toSignal(
    toObservable(this.requestTrigger).pipe(
      switchMap(({ params }) => this.requestService.getAll(params).pipe(map(response => response.data))),
      startWith([])
    ),
    { initialValue: [] }
  );

  toolbarActions = signal<DataViewAction[]>([
    {
      icon: 'filter_list',
      label: 'Adicionar Filtro',
      action: 'filter',
      color: 'primary',
    },
  ]);

  handleToolbarAction(action: DataViewAction) {
    switch (action.action) {
      case 'filter':
        this.openFilterModal();
        break;
    }
  }
  tableColumns = signal<TableColumn[]>([
    {
      key: 'id',
      header: 'ID',
      type: 'text',
    },
    {
      key: 'client.name',
      header: 'Cliente',
      type: 'text',
      slice: { start: 0, end: 30 },
    },
    {
      key: 'equipmentDescription',
      header: 'Equipamento',
      type: 'text',
      slice: { start: 0, end: 30 },
    },
    {
      key: 'createdAt',
      header: 'Data',
      type: 'date',
      dateFormat: 'dd/MM/yyyy HH:mm',
    },
    {
      key: 'translatedState',
      header: 'Estado',
      type: 'badge',
    },
    {
      key: 'actions',
      header: 'Ação',
      type: 'actions',
    },
  ]);

  getStatusClass(status: RequestState): string {
    switch (status) {
      case RequestState.OPEN:
        return 'bg-gray-300 text-gray-600';
      case RequestState.QUOTED:
        return 'bg-amber-300 text-gray-600';
      case RequestState.REJECTED:
        return 'bg-red-300 text-gray-600';
      case RequestState.APPROVED:
        return 'bg-yellow-300 text-gray-600';
      case RequestState.REDIRECTED:
        return 'bg-purple-300 text-gray-600';
      case RequestState.FIXED:
        return 'bg-blue-300 text-gray-600';
      case RequestState.PAID:
        return 'bg-orange-300 text-gray-600';
      case RequestState.COMPLETED:
        return 'bg-green-300 text-gray-600';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  }

  getBadgeClass = (element: MaintenanceRequest, columnKey: string): string => {
    if (columnKey === 'translatedState') {
      const stateClassMap: Record<string, string> = {
        [RequestState.OPEN]: 'bg-gray-200',
        [RequestState.QUOTED]: 'bg-orange-900',
        [RequestState.REJECTED]: 'bg-red-200',
        [RequestState.REDIRECTED]: 'bg-purple-200',
        [RequestState.FIXED]: 'bg-blue-200',
        [RequestState.APPROVED]: 'bg-yellow-200',
        [RequestState.PAID]: 'bg-orange-200',
        [RequestState.COMPLETED]: 'bg-green-200',
      };

      return stateClassMap[element.translatedState];
    }
    return '';
  };

  handleAction(event: { tableAction: TableAction<MaintenanceAction | any>; element: MaintenanceRequest }) {
    const action = event.tableAction.action;
    this.requestService.executeAction(event.element.id.toString(), action).subscribe({
      next: () => {
        this.notificationService.success(`Ação "${action}" executada com sucesso!`);
        this.manualRefresh.update(value => value + 1);
      },
      error: () => {
        this.notificationService.error(`Não foi possível executar a ação de "${action}"`);
      },
    });
  }

  getRowActions = (element: MaintenanceRequest): TableAction<MaintenanceAction | string>[] => {
    const defaultAction = {
      label: 'Visualizar Serviço',
      action: 'view',
      route: ['/employee/requests', element.id.toString()],
    };

    switch (element.translatedState) {
      case RequestState.REDIRECTED:
      case RequestState.APPROVED:
        return [{ ...defaultAction, label: 'Efetuar manutenção' }];

      case RequestState.OPEN:
        return [{ ...defaultAction, label: 'Efetuar orçamento' }];
      case RequestState.PAID:
        return [{ label: 'Finalizar Serviço', action: MaintenanceAction.COMPLETE }];
      default: {
        return element.translatedState !== RequestState.APPROVED ? [defaultAction] : [];
      }
    }
  };

  openFilterModal(): void {
    this.dialog
      .open(FilterRequestsModalComponent, {
        maxWidth: '90vw',
        minWidth: '400px',
        maxHeight: '90vh',
      })
      .afterClosed()
      .subscribe(params => {
        if (!params) return;
        this.filtersSignal.set(params);
      });
  }
}
