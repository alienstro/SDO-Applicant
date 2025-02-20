import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RequestService } from './request.service';
import { CurrentLoanApplication, CurrentLoan, LoanApplication, LoanHistory, LoanStatus, OfficeStatus, CurrentLoanStatus } from '../interface';
import { SnackbarService } from './snackbar.service';
import { TokenService } from './token.service';
import { API_URL } from '../env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanApplicationService {

  private _loanApplicationStatus = new BehaviorSubject<LoanStatus>({
    application_id: 0,
    loan_application_number: 0,
    is_approved_osds: 'Pending',
    is_approved_accounting: 'Pending',
    is_qualified: 'Pending',
  });

  loanApplicationStatus$ = this._loanApplicationStatus.asObservable();

  private _currentLoanApplication = new BehaviorSubject<CurrentLoanApplication>({
    isEditable: false,
    ongoingApplication: false,
    applicationDetails: []
  })

  private _loanHistory = new BehaviorSubject<LoanHistory[]>([]);
  private _officeStatus = new BehaviorSubject<OfficeStatus[]>([])

  loanHistory$ = this._loanHistory.asObservable()

  currentLoanApplication$ = this._currentLoanApplication.asObservable()
  
  officeStatus$ = this._officeStatus.asObservable()

  private _currentLoanStatus = new BehaviorSubject<CurrentLoanStatus>(
    {
      currentLoan: null,
      currentHistory: null
    }
  )

  currentLoanStatus$ = this._currentLoanStatus.asObservable()

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {
    this.initLoanStatus()
    this.initCurrentLoanApplication()
    this.initLoanHistory()
    this.initOfficeStatus()
    this.initCurrentLoan()
  }

  initLoanStatus() {
    const applicantId = this.tokenService.userIDToken(this.tokenService.decodeToken())
    
    const url = `${API_URL}/loanApplication/loanApplicationStatus/${applicantId}`;
    return this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Fetching status loan application:', res.message);
        this.setLoanStatus(res.message);
        console.log(this._loanApplicationStatus.getValue());
      },
      error: (error) => {
        console.error('Error fetching loan application status:', error);
        this.snackbarService.showSnackbar('An error occurred while fetching loan application status');
      }
    });
  }

  initCurrentLoanApplication() {
    this.requestService.get<CurrentLoanApplication>('currentLoanApplication').subscribe({
      next: res => {
        console.log('fetching current loan: ', res.message)
        this.setCurrentLoanApplication(res.message)
        console.log(this._currentLoanApplication.getValue())
      },
      error: error =>
        this.snackbarService.showSnackbar('An error occured while fetching current loan application status')
    })
  }

  initLoanHistory() {
    this.requestService.get<LoanHistory[]>('loanHistory').subscribe({
      next: res => {
        this.setLoanHistory(res.message)
      },
      error: error =>
        this.snackbarService.showSnackbar('An error occured while fetching loan history')
    })
  }

  initOfficeStatus() {
    this.requestService.get<OfficeStatus[]>('officeStatus').subscribe({
      next: res => {
        this._officeStatus.next(res.message)
      },
      error: error => this.snackbarService.showSnackbar('An error occured while fetching office status')
    })
  }


  initCurrentLoan() {
    this.requestService.get<CurrentLoanStatus>('currentLoanApplication').subscribe({
      next: res => {
        this._currentLoanStatus.next(res.message)
      },
      error: error => this.snackbarService.showSnackbar('An error occured while fetching current loan status')
    })
  }

  setLoanStatus(data: LoanStatus) {
    this._loanApplicationStatus.next(data)
  }

  setCurrentLoanApplication(data: CurrentLoanApplication) {
    this._currentLoanApplication.next(data)
  }

  setLoanHistory(data: LoanHistory[]) {
    this._loanHistory.next(data)
  }
}
