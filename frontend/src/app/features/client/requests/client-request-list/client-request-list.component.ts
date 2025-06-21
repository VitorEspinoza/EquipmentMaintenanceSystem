import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { EMPTY, map, startWith, switchMap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { DataListViewComponent } from '../../../../shared/components/data-list-view/data-list-view.component';
import { DynamicTableComponent } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { DataViewAction, TableAction, TableColumn } from '../../../../shared/models/TableColumn';
import { MaintenanceAction } from '../../../requests/shared/models/maintenanceActionComponent';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenanceRequest';
import { RequestState } from '../../../requests/shared/models/RequestState';
import { CLEARED_FILTERS_STATE, FiltersStateService } from '../../../requests/shared/services/filters-state.service';
import { ClientRequestService } from '../../shared/services/client-request.service';
import { CreateRequestModalComponent } from '../create-request-modal/create-request-modal.component';

const MATERIAL_MODULES = [MatTableModule, MatButtonModule, MatDividerModule, MatIconModule];
const COMMON_MODULES = [CommonModule, MatButtonModule];
const CORE_MODULES = [RouterModule];
const SMART_COMPONENTS = [DynamicTableComponent, DataListViewComponent];
@Component({
  selector: 'app-client-request-list',
  imports: [...MATERIAL_MODULES, ...CORE_MODULES, ...COMMON_MODULES, ...SMART_COMPONENTS],
  templateUrl: './client-request-list.component.html',
  styleUrls: ['./client-request-list.component.css'],
})
export class ClientRequestListComponent {
  private readonly requestService = inject(ClientRequestService);
  private readonly notificationService = inject(NotificationService);
  private readonly filtersService = inject(FiltersStateService);
  private dialog = inject(MatDialog);
  private readonly manualRefresh = signal(0);

  readonly requestTrigger = computed(() => ({
    refreshTick: this.manualRefresh(),
  }));

  readonly requests = toSignal(
    toObservable(this.requestTrigger).pipe(
      switchMap(() => this.requestService.getAll().pipe(map(response => response.data))),
      startWith([])
    ),
    { initialValue: [] }
  );

  readonly hasFilters = computed<boolean>(() => {
    const current = this.filtersService.filters();
    return JSON.stringify(current) !== JSON.stringify(CLEARED_FILTERS_STATE);
  });

  tableColumns = signal<TableColumn[]>([
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

  getRowActions = (element: MaintenanceRequest): TableAction<MaintenanceAction | string>[] => {
    const defaultAction = {
      label: 'Visualizar Serviço',
      action: 'view',
      route: ['/client/requests', element.id.toString()],
    };

    switch (element.translatedState) {
      case RequestState.QUOTED:
        return [{ ...defaultAction, label: 'Aprovar ou Rejeitar' }];
      case RequestState.REJECTED:
        return [{ label: 'Resgatar Serviço', action: MaintenanceAction.RESCUE }];
      case RequestState.FIXED:
        return [{ ...defaultAction, label: 'Pagar Serviço' }];
      default: {
        return element.translatedState !== RequestState.APPROVED ? [defaultAction] : [];
      }
    }
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

  toolbarActions = computed<DataViewAction[]>(() => {
    const hasFilters = this.hasFilters();
    const filterAction = {
      icon: hasFilters ? 'filter_list' : 'filter_list_off',
      label: 'Adicionar Filtro',
      action: 'filter',
      color: hasFilters ? 'accent' : 'primary',
    };

    const addSolicitationAction = {
      icon: 'add',
      label: 'Nova Solicitação',
      action: 'create',
      color: 'primary',
    };
    return [filterAction, addSolicitationAction];
  });

  handleToolbarAction(action: DataViewAction) {
    switch (action.action) {
      case 'filter':
        this.filtersService.filters();
        break;
      case 'create':
        this.openCreateRequestModal();
        break;
    }
  }

  openCreateRequestModal(): void {
    this.dialog
      .open(CreateRequestModalComponent, {
        minWidth: '550px',
      })
      .afterClosed()
      .pipe(
        switchMap(response => {
          if (!response) return EMPTY;
          return this.requestService.create(response);
        })
      )
      .subscribe({
        next: () => {
          this.manualRefresh.update(v => v + 1);
        },
        error: () => {
          this.notificationService.error('Falha ao criar solicitação de manutenção');
        },
      });
  }
}
