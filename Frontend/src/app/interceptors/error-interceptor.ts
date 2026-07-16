import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { StorageService } from "../services/storage";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Only clear storage and redirect if they had a token (meaning their session expired)
        // If they don't have a token, it's just a failed login attempt
        if (storage.getAccessToken()) {
          storage.clear();
          router.navigate(["login"]);
        }
      }
      return throwError(() => error);
    }),
  );
};
