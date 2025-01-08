import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

export const loggingInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authToken = inject(AuthService).getToken();
  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${authToken}` }
  });
  return next(cloned);
};
