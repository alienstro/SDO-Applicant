import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../env';
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
    return this.http.post<LoginResponse>(`${API_URL}/`+'applicantLogin', data);
  }

  addLoanApplication(data: any): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${API_URL}/` + `addLoanData`, data);
  }

  addLoanApplicationCoMaker(data: any): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(data);
    return this.http.patch(`${API_URL}/` + `addLoanDataCoMaker`, data);
  }

  get<T>(endpoint: string) {
    return this.http.get<Response<T>>(`${API_URL}/`+`${endpoint}`)
  }

}
