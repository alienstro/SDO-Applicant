import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  getToken() {
    return this.cookieService.get('token') as string;
  }

  flushToken() {
    this.cookieService.delete('token', '/');
  }

  isAuth() {
    return this.getToken().length > 0
  }

}