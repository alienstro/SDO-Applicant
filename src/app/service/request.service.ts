import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mainPort, API_URL } from '../env';
import { Observable } from 'rxjs';
import { Response } from '../interface';
interface LoginResponse {
  token: string
}

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  constructor(private http: HttpClient) { }

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(mainPort + '/sdo_api_v1/API/login', data);
  }

  addLoanApplication(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${API_URL}/addLoanData`, data, { headers });
  }

  get<T>(endpoint: string) {
    return this.http.get<Response<T>>(`${API_URL}/${endpoint}`)
  }

}
