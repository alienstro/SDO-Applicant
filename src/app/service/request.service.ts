import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mainPort } from '../env';
interface LoginResponse {
  token: string
}

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  constructor(private http: HttpClient) { }

  login() {
    return this.http.post<LoginResponse>(mainPort + '/sdo_api_v1/API/login', {});
  }
  // login(data: any, endpoint: string) {
  //   return this.http.post(mainPort + '/sdo_api_v1/API/login' + endpoint, data.getRawValue());
  // }
}
