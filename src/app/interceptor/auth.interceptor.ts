import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const cookie = inject(CookieService);
  const router = inject(Router);

  // NOTE: LẤY TOKEN TỪ COOKIE
  const token = cookie.get('TOKEN');

  // ======================================================
  // NOTE: QUAN TRỌNG
  // KHÔNG GẮN AUTHORIZATION CHO REQUEST CLOUDINARY
  // ======================================================
  if (req.url.includes('api.cloudinary.com')) {
    return next(req); // NOTE: BỎ QUA INTERCEPTOR CHO CLOUDINARY
  }

  // NOTE: CHỈ GẮN TOKEN CHO API BACKEND
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError(err => {

      // NOTE: CHỈ XỬ LÝ AUTH LỖI CHO BACKEND
      if (err.status === 401 || err.status === 403) {
        cookie.delete('TOKEN');
        cookie.delete('ROLE');
        cookie.delete('USERNAME');
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
