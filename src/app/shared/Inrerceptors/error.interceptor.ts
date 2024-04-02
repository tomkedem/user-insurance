import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if ([401, 403].indexOf(error.status) !== -1) {
        console.log('Unauthorized request');
      }
      if (error.status === 404) {
        console.log('Not found error occurred');
      }     
      return throwError(() => error);
    })
  );
};
