import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  isSidebarCollapsed = input.required<boolean>();
  changeIsSidebarCollapsed = output<boolean>();

  items = [
    {
      routeLink: 'client/solicitations',
      icon: 'table_view',
      label: 'Solicitações do Cliente',
    },
    {
      routeLink: 'employee',
      icon: 'home',
      label: 'Home do Funcionário',
    },
    {
      routeLink: 'employee/solicitations',
      icon: 'table_view',
      label: 'Solicitações do Funcionário',
    },
    {
      routeLink: 'employee/equipment-category',
      icon: 'sell',
      label: 'Categorias de Equipamento',
    },
  ];

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }
}
