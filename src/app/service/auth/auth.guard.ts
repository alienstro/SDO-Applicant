import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();

  if (!token || token.length <= 0) {
    await router.navigate(['login']); // Wait for navigation to complete
    return false;
  }

  return true;
};
