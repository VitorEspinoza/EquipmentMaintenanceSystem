import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { DataViewAction, TableAction, TableColumn } from '../../../../../shared/models/TableColumn';
import { MaintenanceRequest } from '../maintenance-request';
import { IMaintenanceRequestService } from '../maintenance-request-service';

export interface RequestListStrategy {
  doInitActions?(): void;

  getRequestService(): IMaintenanceRequestService;

  getTableColumns(): TableColumn[];

  getRowActions(request: MaintenanceRequest): TableAction<any>[];

  getToolbarActions(hasFilters: boolean): DataViewAction<string>[];

  handleToolbarAction(action: DataViewAction<string>): Observable<any>;

  handleTableAction(event: { tableAction: TableAction<any>; element: MaintenanceRequest }): Observable<void>;
}

export const REQUEST_LIST_STRATEGY = new InjectionToken<RequestListStrategy>('RequestListStrategy');
