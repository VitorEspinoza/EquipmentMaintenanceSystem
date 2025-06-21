import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { NavigationItem, PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidenav',
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  isSidebarCollapsed = input.required<boolean>();
  changeIsSidebarCollapsed = output<boolean>();
  private readonly permissionService = inject(PermissionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  items!: NavigationItem[];
  ngOnInit(): void {
    this.items = this.permissionService.permissedMenuItems();
  }

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }

  logout(): void {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
    });
  }
}
