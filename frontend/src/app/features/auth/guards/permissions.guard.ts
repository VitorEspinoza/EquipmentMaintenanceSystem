import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../../../core/services/permission.service';

export const permissionsGuard: CanActivateFn = route => {
  const { permissions } = route.data;

  return inject(PermissionService).userIsAllowed(permissions) ? true : inject(Router).createUrlTree(['/']);
};
