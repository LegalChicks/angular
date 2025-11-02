import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor to automatically add JWT token to authenticated requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage
  const token = localStorage.getItem('authToken');

  // If token exists, add it to the Authorization header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};

