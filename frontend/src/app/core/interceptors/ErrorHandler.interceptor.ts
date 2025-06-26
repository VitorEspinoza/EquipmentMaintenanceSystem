import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, NEVER, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status === 401 && authService.isAuthenticated()) {
        notificationService.info('Sua sessão expirou. Por favor, faça o login novamente.');

        return authService.logout().pipe(
          switchMap(() => {
            router.navigate(['/login']);
            return NEVER;
          })
        );
      }

      switch (error.status) {
        case 403:
          notificationService.error('Você não tem permissão para executar esta ação.');
          router.navigate(['/']);
          break;
        case 500:
          notificationService.error('Ocorreu um erro inesperado. Nossa equipe já foi notificada.');
          break;
        case 0:
          notificationService.error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
          break;
      }

      return throwError(() => error);
    })
  );
};
