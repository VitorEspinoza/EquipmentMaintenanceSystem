import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const allowedUrls: string[] = ['viacep.com.br', 'servicodados.ibge.gov.br'];

  const shouldSkipCredentials = allowedUrls.some(url => req.url.includes(url));

  if (shouldSkipCredentials) {
    return next(req);
  }

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq);
};
