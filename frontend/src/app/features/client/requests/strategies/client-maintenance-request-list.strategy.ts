import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, EMPTY, filter, Observable, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { DataViewAction, TableAction, TableColumn } from '../../../../shared/models/TableColumn';
import { MaintenanceAction } from '../../../requests/shared/models/maintenance-action/maintenance-action';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenance-request';
import { IMaintenanceRequestService } from '../../../requests/shared/models/maintenance-request-service';
import { MaintenanceRequestState } from '../../../requests/shared/models/maintenance-request-state';
import { RequestListStrategy } from '../../../requests/shared/models/strategies/maintenance-request-list.strategy';
import { FiltersStateService } from '../../../requests/shared/services/filters-state.service';
import { ClientRequestService } from '../../shared/services/client-request.service';
import { CreateRequestModalComponent } from '../create-request-modal/create-request-modal.component';

@Injectable()
export class ClientRequestListStrategy implements RequestListStrategy {
  private readonly clientRequestService = inject(ClientRequestService);
  private readonly notificationService = inject(NotificationService);
  private readonly filtersService = inject(FiltersStateService);
  private readonly dialog = inject(MatDialog);

  doInitActions() {
    this.filtersService.resetFilters();
  }
  getRequestService(): IMaintenanceRequestService {
    return this.clientRequestService;
  }

  getTableColumns(): TableColumn[] {
    return [
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
    ];
  }

  getRowActions = (element: MaintenanceRequest): TableAction<MaintenanceAction | string>[] => {
    const defaultAction = {
      label: 'Visualizar Serviço',
      action: 'view',
      route: ['/client/requests', element.id.toString()],
    };

    switch (element.translatedState) {
      case MaintenanceRequestState.QUOTED:
        return [{ ...defaultAction, label: 'Aprovar ou Rejeitar' }];
      case MaintenanceRequestState.REJECTED:
        return [{ label: 'Resgatar Serviço', action: MaintenanceAction.RESCUE }];
      case MaintenanceRequestState.FIXED:
        return [{ ...defaultAction, label: 'Pagar Serviço' }];
      default: {
        return element.translatedState !== MaintenanceRequestState.APPROVED ? [defaultAction] : [];
      }
    }
  };

  handleTableAction(event: { tableAction: TableAction<any>; element: MaintenanceRequest }): Observable<void> {
    const action = event.tableAction.action;
    return this.clientRequestService.executeAction(event.element.id.toString(), action).pipe(
      tap(() => this.notificationService.success(`Ação "${action}" executada com sucesso!`)),
      catchError(() => {
        this.notificationService.error(`Não foi possível executar a ação de "${action}"`);
        return EMPTY;
      })
    );
  }

  getToolbarActions(hasFilters: boolean): DataViewAction<string>[] {
    const filterAction = {
      icon: hasFilters ? 'filter_list' : 'filter_list_off',
      label: 'Adicionar Filtro',
      action: 'filter',
      color: hasFilters ? 'accent' : 'primary',
    };

    const addRequestAction = {
      icon: 'add',
      label: 'Nova Solicitação',
      action: 'create',
      color: 'primary',
    };
    return [filterAction, addRequestAction];
  }

  handleToolbarAction(action: DataViewAction<string>): Observable<any> {
    switch (action.action) {
      case 'create':
        return this.openCreateRequestModal();
      case 'filter':
        this.filtersService.openFilterModal();
        return EMPTY;

      default:
        return EMPTY;
    }
  }

  openCreateRequestModal(): Observable<any> {
    return this.dialog
      .open(CreateRequestModalComponent, {
        minWidth: '550px',
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(response =>
          this.clientRequestService.create(response).pipe(
            tap(() => {
              this.notificationService.success('Solicitação de manutenção criada com sucesso!');
            }),
            catchError(() => {
              this.notificationService.error('Falha ao criar solicitação de man]utenção');
              return EMPTY;
            })
          )
        )
      );
  }
}
