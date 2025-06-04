import { computed, Injectable, signal } from '@angular/core';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  accountRole = signal<Role | null>(null);
  items: NavigationItem[] = [
    {
      routeLink: 'client/solicitations',
      icon: 'table_view',
      label: 'Solicitações do Cliente',
      permissedRoles: [Role.CLIENT],
    },
    {
      routeLink: 'employee',
      icon: 'home',
      label: 'Home do Funcionário',
      permissedRoles: [Role.EMPLOYEE],
    },
    {
      routeLink: 'employee/solicitations',
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
    const role = this.accountRole();
    if (!role) {
      return [];
    }

    return this.items.filter(item => item.permissedRoles.includes(role));
  });
}

export interface NavigationItem {
  routeLink: string;
  icon: string;
  label: string;
  permissedRoles: Role[];
}
