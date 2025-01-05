import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  //Decode current token held
  const auth = inject(AuthService);
  const router = inject(Router)

  if(auth.getToken() === null) {
    router.navigate([auth.getRedirectUrl])
    console.log('Uuuu')
    return false;
  }
  // Check the existance of token
  if (auth.getToken().length <= 0) {
    console.log('Uuuu')
    router.navigate([auth.getRedirectUrl])
    return false;
  }
  
  console.log('ooo')
  return true;

};