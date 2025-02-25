import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { CacheService } from "../services/cache.service";

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const cacheService = inject(CacheService)
  const token = cacheService.getItem('ACCESS_TOKEN')

  const requestClone = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })

  return next(requestClone)
}
