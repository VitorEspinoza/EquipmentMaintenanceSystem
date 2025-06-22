import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RequestState } from './../../../requests/shared/models/RequestState';

import { HttpResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, map, Observable, startWith, switchMap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { DataListViewComponent } from '../../../../shared/components/data-list-view/data-list-view.component';
import { DynamicTableComponent } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { DataViewAction, TableAction, TableColumn } from '../../../../shared/models/TableColumn';
import { FileDownloadService } from '../../../../shared/services/file-download.service';
import { MaintenanceAction } from '../../../requests/shared/models/maintenanceActionComponent';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenanceRequest';
import { CLEARED_FILTERS_STATE, FiltersStateService } from '../../../requests/shared/services/filters-state.service';
import { EmployeeRequestService } from '../../services/employee-request.service';
import { ReportFilters } from '../../shared/models/reportFilters';
import { ReportFilterModalComponent } from '../report-filter-modal/report-filter-modal.component';

@Component({
  selector: 'app-employee-request-list',
  imports: [
    DataListViewComponent,
    DynamicTableComponent,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './employee-request-list.component.html',
  styleUrl: './employee-request-list.component.css',
})
export class EmployeeRequestListComponent {
  private readonly requestService: EmployeeRequestService = inject(EmployeeRequestService);
  private readonly notificationService = inject(NotificationService);
  private readonly filtersService = inject(FiltersStateService);
  private readonly fileDownloadService = inject(FileDownloadService);
  private readonly dialog = inject(MatDialog);

  private readonly manualRefresh = signal(0);

  readonly requestTrigger = computed(() => ({
    refreshTick: this.manualRefresh(),
    filters: this.filtersService.filters(),
  }));

  readonly hasFilters = computed<boolean>(() => {
    const current = this.filtersService.filters();
    return JSON.stringify(current) !== JSON.stringify(CLEARED_FILTERS_STATE);
  });

  readonly requests = toSignal(
    toObservable(this.requestTrigger).pipe(
      switchMap(() => this.requestService.getAll().pipe(map(response => response.data))),
      startWith([])
    ),
    { initialValue: [] }
  );

  toolbarActions = computed<DataViewAction<string>[]>(() => {
    const hasFilters = this.hasFilters();
    const filterAction = {
      icon: hasFilters ? 'filter_list' : 'filter_list_off',
      label: 'Adicionar Filtro',
      action: 'filter',
      color: hasFilters ? 'accent' : 'primary',
    };

    return [filterAction];
  });

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

  handleToolbarAction(toolbarAction: Partial<DataViewAction<string>>): void {
    switch (toolbarAction.action) {
      case 'filter':
        this.filtersService.openFilterModal();
        break;

      case 'revenue_by_category_report':
        this.downloadRevenueByCategoryReport();
        break;

      case 'filtered_revenue_report':
        this.openFilteredRevenueReportDialog();
        break;
    }
  }

  private openFilteredRevenueReportDialog(): void {
    const dialogRef = this.dialog.open(ReportFilterModalComponent, {
      width: '400px',
      minHeight: '250px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result): result is ReportFilters => !!result))
      .subscribe(filters => {
        this.downloadFilteredRevenueReport(filters);
      });
  }

  public downloadFilteredRevenueReport(filters: ReportFilters): void {
    const reportRequest$ = this.requestService.downloadGeneralRevenueReport(filters);
    const filename = 'relatorio_geral_de_receitas.pdf';
    this._handleReportDownload(reportRequest$, filename);
  }

  public downloadRevenueByCategoryReport(): void {
    const reportRequest$ = this.requestService.downloadRevenueByCategoryReport();
    const filename = 'relatorio_receita_por_categoria.pdf';
    this._handleReportDownload(reportRequest$, filename);
  }

  private _handleReportDownload(reportRequest$: Observable<HttpResponse<Blob>>, filename: string): void {
    reportRequest$.subscribe({
      next: response => {
        const blob = response.body;
        if (!blob || blob.size === 0) {
          this.notificationService.error('Erro ao baixar: o arquivo retornado está vazio.');
          return;
        }
        this.fileDownloadService.saveFile(blob, filename);
      },
      error: err => {
        console.error('Falha no download do relatório:', err);
        this.notificationService.error('Não foi possível baixar o relatório.');
      },
    });
  }

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
}
