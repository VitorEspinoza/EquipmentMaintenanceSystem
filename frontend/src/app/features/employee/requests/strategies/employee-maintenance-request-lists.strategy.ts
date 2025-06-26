import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, EMPTY, filter, Observable, tap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { DataViewAction, TableAction, TableColumn } from '../../../../shared/models/TableColumn';
import { FileDownloadService } from '../../../../shared/services/file-download.service';
import { MaintenanceAction } from '../../../requests/shared/models/maintenance-action/maintenance-action';
import { MaintenanceRequest } from '../../../requests/shared/models/maintenance-request';
import { IMaintenanceRequestService } from '../../../requests/shared/models/maintenance-request-service';
import { MaintenanceRequestState } from '../../../requests/shared/models/maintenance-request-state';
import { RequestListStrategy } from '../../../requests/shared/models/strategies/maintenance-request-list.strategy';
import { FiltersService } from '../../../requests/shared/services/filters-state.service';
import { EmployeeRequestService } from '../../services/employee-request.service';
import { ReportFilters } from '../../shared/models/reportFilters';
import { ReportFilterModalComponent } from '../report-filter-modal/report-filter-modal.component';

@Injectable()
export class EmployeeRequestListStrategy implements RequestListStrategy {
  private readonly employeeRequestService = inject(EmployeeRequestService);
  private readonly notificationService = inject(NotificationService);
  private readonly filtersService = inject(FiltersService);
  private readonly fileDownloadService = inject(FileDownloadService);
  private readonly dialog = inject(MatDialog);

  getRequestService(): IMaintenanceRequestService {
    return this.employeeRequestService;
  }

  getTableColumns(): TableColumn[] {
    return [
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
    ];
  }

  getRowActions = (element: MaintenanceRequest): TableAction<MaintenanceAction | string>[] => {
    const defaultAction = {
      label: 'Visualizar Serviço',
      action: 'view',
      route: ['/employee/requests', element.id.toString()],
    };

    switch (element.translatedState) {
      case MaintenanceRequestState.REDIRECTED:
      case MaintenanceRequestState.APPROVED:
        return [{ ...defaultAction, label: 'Efetuar manutenção' }];

      case MaintenanceRequestState.OPEN:
        return [{ ...defaultAction, label: 'Efetuar orçamento' }];
      case MaintenanceRequestState.PAID:
        return [{ label: 'Finalizar Serviço', action: MaintenanceAction.COMPLETE }];
      default: {
        return element.translatedState !== MaintenanceRequestState.APPROVED ? [defaultAction] : [];
      }
    }
  };

  handleTableAction(event: { tableAction: TableAction<any>; element: MaintenanceRequest }): Observable<void> {
    const action = event.tableAction.action;
    return this.employeeRequestService.executeAction(event.element.id.toString(), action).pipe(
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

    return [filterAction];
  }

  handleToolbarAction(toolbarAction: Partial<DataViewAction<string>>): Observable<any> {
    switch (toolbarAction.action) {
      case 'filter':
        this.filtersService.openFilterModal();
        return EMPTY;

      case 'revenue_by_category_report':
        this.downloadRevenueByCategoryReport();
        return EMPTY;

      case 'filtered_revenue_report':
        this.openFilteredRevenueReportDialog();
        return EMPTY;

      default:
        return EMPTY;
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
    const reportRequest$ = this.employeeRequestService.downloadGeneralRevenueReport(filters);
    const filename = 'relatorio_geral_de_receitas.pdf';
    this._handleReportDownload(reportRequest$, filename);
  }

  public downloadRevenueByCategoryReport(): void {
    const reportRequest$ = this.employeeRequestService.downloadRevenueByCategoryReport();
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
}
