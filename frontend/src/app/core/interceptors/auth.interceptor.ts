import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const authService = inject(AuthService);

  const allowedUrls: string[] = ['viacep.com.br', 'servicodados.ibge.gov.br'];
  const shouldSkipCredentials = allowedUrls.some(url => req.url.includes(url));

  if (shouldSkipCredentials) {
    return next(req);
  }

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    catchError(error => {
      if (error.status === 401 && authService.isAuthenticated()) {
        notificationService.info('Sua sessão expirou. Por favor, faça o login novamente.');

        authService.logout().subscribe({
          complete: () => router.navigate(['/login']),
        });
      }
      return throwError(() => error);
    })
  );
};
