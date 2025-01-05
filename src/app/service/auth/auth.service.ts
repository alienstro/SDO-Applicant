import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  redirectUrl: string = '/login';

  getToken() {
    return this.cookieService.get('token') as string;
  }

  flushToken() {
    this.cookieService.delete('token', '/');
  }

  isAuth() {
    return this.getToken().length > 0
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  get getRedirectUrl(): string {
    return this.redirectUrl;
  }

}