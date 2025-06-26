import { Component, contentChild, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataViewAction } from '../../models/TableColumn';

@Component({
  selector: 'app-data-list-view',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './data-list-view.component.html',
  styleUrl: './data-list-view.component.css',
})
export class DataListViewComponent<TAction> {
  title = input<string>();
  subtitle = input<string>();
  actions = input<DataViewAction<TAction>[]>([]);

  containerClass = input('bg-white shadow-md rounded-lg flex flex-col p-6');
  titleClass = input('text-2xl font-semibold text-gray-800 mb-4 text-center');
  contentClass = input('overflow-x-auto min-w-0');
  toolbarClass = input('p-2 flex justify-end gap-6 mb-4');

  showToolbar = input(true);
  hasFooter = input(false);

  actionClicked = output<DataViewAction<TAction>>();

  headerContent = contentChild('[slot=header]');
  footerContent = contentChild('[slot=footer]');
  toolbarContent = contentChild('[slot=toolbar]');
}
