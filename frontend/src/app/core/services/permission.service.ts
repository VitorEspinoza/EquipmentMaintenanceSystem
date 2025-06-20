import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly authService = inject(AuthService);
  items: NavigationItem[] = [
    {
      routeLink: 'client/requests',
      icon: 'table_view',
      label: 'Solicitações do Cliente',
      permissedRoles: [Role.CLIENT],
    },
    {
      routeLink: 'employee/requests',
      icon: 'table_view',
      label: 'Solicitações do Funcionário',
      permissedRoles: [Role.EMPLOYEE],
    },
    {
      routeLink: 'employee/equipment-category',
      icon: 'sell',
      label: 'Categorias de Equipamento',
      permissedRoles: [Role.EMPLOYEE],
    },
    {
      routeLink: 'employee/manage',
      icon: 'badge',
      label: 'Funcionários',
      permissedRoles: [Role.EMPLOYEE],
    },
  ];

  permissedMenuItems = computed(() => {
    const account = this.authService.account();

    if (!account) return [];

    const role = account.role;

    return this.items.filter(item => item.permissedRoles.includes(role));
  });
}

export interface NavigationItem {
  routeLink: string;
  icon: string;
  label: string;
  permissedRoles: Role[];
}
