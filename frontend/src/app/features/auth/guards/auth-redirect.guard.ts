import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../../../core/models/role';
import { AuthService } from '../services/auth.service';

export const authRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const account = inject(AuthService).account();
  if (!account) router.navigate(['/login']);

  if (account!.role == Role.EMPLOYEE) router.navigate(['employee/requests']);
  else router.navigate(['client/requests']);

  return false;
};
