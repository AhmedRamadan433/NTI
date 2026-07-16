import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage';

export const guestGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (storage.getAccessToken()) {
    return router.parseUrl('');
  }

  return true;
};
