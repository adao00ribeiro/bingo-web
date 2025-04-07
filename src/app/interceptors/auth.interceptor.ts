import { HttpRequest, HttpInterceptorFn, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { RefreshTokenService } from '../services/auth/refresh-token.service';
import { STORAGE_REFRESH_TOKEN, STORAGE_TOKEN } from '../constants/storage.service.constants';
import { StorageService } from '../services/storage.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
const REFRESH_URL =`${environment.api}/api/v1/identity/refresh-login`
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url === REFRESH_URL) {
    return next(req);
  }
  const refreshTokenService = inject(RefreshTokenService);
  const storageService = inject(StorageService);
  const router = inject(Router);

  const cloneReq = getRequestWithUpdatedToken(req,storageService);

  return next(cloneReq).pipe(
    catchError((error) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }
      return refreshTokenService.refresh().pipe(
        tap((rtResponse) => {
          if (rtResponse.accessToken && rtResponse.refreshToken) {
            storageService.setSessionItem(STORAGE_TOKEN, rtResponse.accessToken)
            storageService.setSessionItem(STORAGE_REFRESH_TOKEN, rtResponse.refreshToken)
          }
        }
        ),
        switchMap(() => next(getRequestWithUpdatedToken(req,storageService))),
        catchError((error) => {
          storageService.clearSession();
          router.navigateByUrl('/login')
          return throwError(() => error);
        })
      );
    })
  );;
};
const getRequestWithUpdatedToken = (req: HttpRequest<any> ,    storageService: StorageService) => {

  const token = storageService.getSessionItem(STORAGE_TOKEN);
  if (!token) return req;

  const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);
  return req.clone({
    headers,
  });
}
