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
      routeLink: 'login',
      icon: 'home',
      label: 'teste 1',
    },
    {
      routeLink: '#',
      icon: 'bed',
      label: 'teste 2',
    },
    {
      routeLink: '#',
      icon: 'tv',
      label: 'teste 3',
    },
    {
      routeLink: '#',
      icon: 'chair',
      label: 'teste 4',
    },
    {
      routeLink: '#',
      icon: 'grass',
      label: 'teste 5',
    },
  ];

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }
}
