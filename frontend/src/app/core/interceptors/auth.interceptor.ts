import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('https://') || req.url.startsWith('http://')) {
    const clonedReq = req.clone({ withCredentials: false });
    return next(clonedReq);
  }

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq);
};
