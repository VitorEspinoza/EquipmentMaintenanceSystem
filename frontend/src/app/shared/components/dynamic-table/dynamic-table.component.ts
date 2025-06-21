import { AfterViewInit, Component, computed, effect, input, output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TableAction, TableColumn } from '../../models/TableColumn';
@Component({
  selector: 'app-dynamic-table',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, RouterModule, MatPaginatorModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css',
})
export class DynamicTableComponent<TAction = any, TData = any> implements AfterViewInit {
  dataSource = input.required<TData[]>();
  columns = input.required<TableColumn[]>();
  tableClass = input('mat-elevation-z8 w-full');
  rowClass = input('hover:bg-gray-50 transition-colors');
  emptyMessage = input('Nenhum registro encontrado');
  showPaginator = input(false);

  badgeClassResolver = input<(element: TData, columnKey: string) => string>();
  actionsResolver = input<(element: TData) => TableAction<TAction>[]>();

  actionClicked = output<{ tableAction: TableAction<TAction>; element: TData }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  internalDataSource = new MatTableDataSource<any>();

  displayedColumns = computed(() => this.columns().map(col => col.key as string));

  processedData = computed(() => {
    const data = this.dataSource();
    const cols = this.columns();
    const badgeResolver = this.badgeClassResolver();
    const actionResolver = this.actionsResolver();
    return data.map(item => {
      return {
        original: item,
        processed: this.processRowData(item, cols),
        actions: actionResolver?.(item) || [],
        badgeClasses: this.processBadgeClasses(item, cols, badgeResolver),
      };
    });
  });

  constructor() {
    effect(() => {
      this.internalDataSource.data = this.processedData();
    });
  }

  ngAfterViewInit() {
    this.internalDataSource.paginator = this.paginator;
  }

  private processRowData(item: TData, columns: TableColumn[]): Record<string, any> {
    const processed: Record<string, any> = {};

    columns.forEach(column => {
      const key = column.key as string;
      let value = this.getNestedValue(item, key);

      switch (column.type) {
        case 'date':
          if (value) {
            const date = new Date(value);
            const format = column.dateFormat || 'dd/MM/yyyy HH:mm';
            processed[key] = this.formatDate(date, format);
          }
          break;

        case 'text':
          if (column.slice && typeof value === 'string') {
            value = value.slice(column.slice.start, column.slice.end);
          }
          processed[key] = value || column.defaultValue || '';
          break;

        default:
          processed[key] = value;
      }
    });

    return processed;
  }

  private processBadgeClasses(
    item: TData,
    columns: TableColumn[],
    resolver?: (element: TData, columnKey: string) => string
  ): Record<string, string> {
    const badgeClasses: Record<string, string> = {};

    columns
      .filter(col => col.type === 'badge')
      .forEach(col => {
        const key = col.key as string;
        badgeClasses[key] = resolver?.(item, key) || '';
      });

    return badgeClasses;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private formatDate(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return format
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', year.toString())
      .replace('HH', hours)
      .replace('mm', minutes);
  }
}
