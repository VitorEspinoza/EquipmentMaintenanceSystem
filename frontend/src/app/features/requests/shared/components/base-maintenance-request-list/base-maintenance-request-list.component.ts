import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, switchMap } from 'rxjs';
import { DataListViewComponent } from '../../../../../shared/components/data-list-view/data-list-view.component';
import { DataViewAction, TableAction } from '../../../../../shared/models/TableColumn';
import { MaintenanceRequest } from '../../models/maintenance-request';
import { MaintenanceRequestState } from '../../models/maintenance-request-state';
import { REQUEST_LIST_STRATEGY, RequestListStrategy } from '../../models/strategies/maintenance-request-list.strategy';
import { CLEARED_FILTERS_STATE, FiltersService } from '../../services/filters-state.service';
import { DynamicTableComponent } from './../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-base-maintenance-request-list',
  imports: [DataListViewComponent, DynamicTableComponent],
  templateUrl: './base-maintenance-request-list.component.html',
  styleUrl: './base-maintenance-request-list.component.css',
})
export class BaseMaintenanceRequestListComponent implements OnInit {
  private readonly filtersService = inject(FiltersService);

  private strategy: RequestListStrategy = inject(REQUEST_LIST_STRATEGY);
  private requestService = this.strategy.getRequestService();

  public readonly manualRefresh = signal(0);
  private requestTrigger = computed(() => ({
    refreshTick: this.manualRefresh(),
    filters: this.filtersService.filters(),
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

  readonly tableColumns = computed(() => this.strategy.getTableColumns());
  readonly toolbarActions = computed(() => this.strategy.getToolbarActions(this.hasFilters()));

  getRowActions = (element: MaintenanceRequest) => this.strategy.getRowActions(element);

  ngOnInit(): void {
    if (this.strategy.doInitActions) {
      this.strategy.doInitActions();
    }
  }
  handleAction = (event: { tableAction: TableAction<any>; element: MaintenanceRequest }) => {
    this.strategy.handleTableAction(event).subscribe(() => {
      this.manualRefresh.update(value => value + 1);
    });
  };

  handleToolbarAction = (action: DataViewAction<string>) => {
    this.strategy.handleToolbarAction(action).subscribe({
      next: () => {
        this.manualRefresh.update(value => value + 1);
      },
    });
  };

  getBadgeClass = (element: MaintenanceRequest, columnKey: string): string => {
    if (columnKey === 'translatedState') {
      const stateClassMap: Record<string, string> = {
        [MaintenanceRequestState.OPEN]: 'bg-gray-200',
        [MaintenanceRequestState.QUOTED]: 'bg-orange-900 text-white',
        [MaintenanceRequestState.REJECTED]: 'bg-red-200',
        [MaintenanceRequestState.REDIRECTED]: 'bg-purple-200',
        [MaintenanceRequestState.FIXED]: 'bg-blue-200',
        [MaintenanceRequestState.APPROVED]: 'bg-yellow-200',
        [MaintenanceRequestState.PAID]: 'bg-orange-400 text-white',
        [MaintenanceRequestState.COMPLETED]: 'bg-green-200',
      };
      return stateClassMap[element.translatedState];
    }
    return '';
  };
}
