import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RequestService } from './request.service';
import { CurrentLoanApplication, CurrentLoan, LoanApplication, LoanHistory, LoanStatus, OfficeStatus, CurrentLoanStatus } from '../interface';
import { SnackbarService } from './snackbar.service';

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

  loanHistory$ = this._loanHistory.asObservable()

  currentLoanApplication$ = this._currentLoanApplication.asObservable()

  private _officeStatus = new BehaviorSubject<OfficeStatus[]>([])

  officeStatus$ = this._officeStatus.asObservable()

  /*
  export interface CurrentLoan {
    application_id: string,
    application_date: string,
    status: string
  }


  export interface CurrentHistory {
    application_history_id: string;
    application_id: string;
    remarks: string;
    history_date: string;
    initiator: string;
  }


  export interface CurrentLoanStatus {
    currentLoan: CurrentLoan
    currentHistory: CurrentHistory
  }


  */

  private _currentLoanStatus = new BehaviorSubject<CurrentLoanStatus>(
    {
      currentLoan: null,
      currentHistory: null
    }
  )

  currentLoanStatus$ = this._currentLoanStatus.asObservable()

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) {
    this.initLoanStatus()
    this.initCurrentLoanApplication()
    this.initLoanHistory()
    this.initOfficeStatus()
    this.initCurrentLoan()
  }

  initLoanStatus() {
    this.requestService.get<LoanStatus>('loanApplicationStatus').subscribe({
      next: res => {
        console.log('fetching status loan application: ', res.message)
        this.setLoanStatus(res.message)
        console.log(this._loanApplicationStatus.getValue())
      },
      error: error =>
        this.snackbarService.showSnackbar('An error occured while fetching loan application status')
    })
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
