import { CommonModule } from '@angular/common';
import { Component, contentChild, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataViewAction } from '../../models/TableColumn';

@Component({
  selector: 'app-data-list-view',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './data-list-view.component.html',
  styleUrl: './data-list-view.component.css',
})
export class DataListViewComponent {
  title = input<string>();
  subtitle = input<string>();
  actions = input<DataViewAction[]>([]);

  containerClass = input('p-12 bg-white shadow-md rounded-lg flex flex-col');
  titleClass = input('text-2xl font-semibold text-gray-800 mb-4 text-center');
  contentClass = input('overflow-x-auto');
  toolbarClass = input('p-2 flex justify-end gap-6 mb-4');

  showToolbar = input(true);
  hasFooter = input(false);

  actionClicked = output<DataViewAction>();

  headerContent = contentChild('[slot=header]');
  footerContent = contentChild('[slot=footer]');
  toolbarContent = contentChild('[slot=toolbar]');
}
