import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If token exists in localStorage, grant clean access to the dashboard route
  if (authService.isLoggedIn()) {
    return true;
  }

  // Otherwise, block access entirely and redirect them straight to the entry wall
  router.navigate(['/admin-login']);
  return false;
};
