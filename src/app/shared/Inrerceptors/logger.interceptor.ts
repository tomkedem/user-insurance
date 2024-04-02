import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`Request is on its way to ${req.url}`)
  // Add token to the request in the header
  const authReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer Tomer Token')
  });
 
  return next(authReq);
};
