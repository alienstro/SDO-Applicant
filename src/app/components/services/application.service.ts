import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, ObservableLike } from 'rxjs';
import { BorrowersInformation, CoMakersInformation, LoanApplication, LoanDetails } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constant';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private _loanApplication = new BehaviorSubject<LoanApplication[]>([]);
  private _loanDetails = new BehaviorSubject<LoanDetails[]>([]);
  private _coMakersInformation = new BehaviorSubject<CoMakersInformation[]>([]);
  private _borrowersInformation = new BehaviorSubject<BorrowersInformation[]>([]);

  $loanApplication = this._loanApplication.asObservable();
  $loanDetails = this._loanDetails.asObservable();
  $coMakersInformation = this._coMakersInformation.asObservable();
  $borrowersInformation = this._borrowersInformation.asObservable();

  constructor(private http: HttpClient) {
    forkJoin({

    });
  }

  getLoanApplication(): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${API_URL}/loanApplication`);
  }

  getLoanDetails(): Observable<LoanDetails[]>{
    return this.http.get<LoanDetails[]>(`${API_URL}/loanDetails`);
  }

  getCoMakersInformation(): Observable<CoMakersInformation[]> {
    return this.http.get<CoMakersInformation[]>(`${API_URL}/coMakersInformation`);
  }

  getBorrowersInformation(): Observable<BorrowersInformation[]> {
    return this.http.get<BorrowersInformation[]>(`${API_URL}/borrowersInformation`);
  }

  createLoanApplication(data: any): Observable<any> {
    return this.http.post(`${API_URL}/addLoanData`, data)
  }
}
