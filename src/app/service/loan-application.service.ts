import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RequestService } from './request.service';
import {
  CurrentLoanApplication,
  CurrentLoan,
  LoanApplication,
  LoanHistory,
  LoanStatus,
  OfficeStatus,
  CurrentLoanStatus,
} from '../interface';
import { SnackbarService } from './snackbar.service';
import { TokenService } from './token.service';
import { API_URL } from '../env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
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

  private _currentLoanApplication = new BehaviorSubject<CurrentLoanApplication>(
    {
      isEditable: false,
      ongoingApplication: false,
      applicationDetails: [],
    }
  );

  private _loanHistory = new BehaviorSubject<LoanHistory[]>([]);
  private _officeStatus = new BehaviorSubject<OfficeStatus[]>([]);

  loanHistory$ = this._loanHistory.asObservable();
  currentLoanApplication$ = this._currentLoanApplication.asObservable();
  officeStatus$ = this._officeStatus.asObservable();

  private _currentLoanStatus = new BehaviorSubject<CurrentLoanStatus>({
    currentLoan: null,
    currentHistory: null,
  });

  currentLoanStatus$ = this._currentLoanStatus.asObservable();

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {
    // this.initLoanStatus();
    // this.initCurrentLoanApplication();
    // this.initLoanHistory();
    // this.initOfficeStatus();
    // this.initCurrentLoan();
    // console.log('HAHAHAAHAHAAHA: ', this._officeStatus.getValue());
  }

  initLoanStatus() {
    const applicantId = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );
    const url = `${API_URL}/loanApplication/loanApplicationStatus/${applicantId}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Fetching status loan application:', res.message);
        this.setLoanStatus(res.message);
        console.log(this._loanApplicationStatus.getValue());
      },
      error: (error) => {
        console.error('Error fetching loan application status:', error);
        console.log('An error occurred while fetching loan application status');
      },
    });
  }

  initLoanStatusCoMaker() {
    const email = this.tokenService.userEmailToken(
      this.tokenService.decodeToken()
    );
    const url = `${API_URL}/loanApplication/loanApplicationStatusCoMaker/${email}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Fetching status loan application:', res.message);
        this.setLoanStatus(res.message);
        console.log(this._loanApplicationStatus.getValue());
      },
      error: (error) => {
        console.error('Error fetching loan application status:', error);
        console.log('An error occurred while fetching loan application status');
      },
    });
  }

  initCoMakerLoanStatus(application_id: number) {
    const url = `${API_URL}/loanApplication/CoMakerLoanApplicationStatus/${application_id}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Fetching status co-maker loan application:', res.message);
        this.setLoanStatus(res.message);
        console.log(this._loanApplicationStatus.getValue());
      },
      error: (error) => {
        console.error(
          'Error fetching co-maker loan application status:',
          error
        );
        console.log(
          'An error occurred while fetching co-maker loan application status'
        );
      },
    });
  }

  initLoanHistory() {
    const applicantId = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );
    const url = `${API_URL}/loanApplication/loanHistory/${applicantId}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        this.setLoanHistory(res.message);
      },
      error: (error) =>
        console.log('An error occurred while fetching loan history'),
    });
  }

  initLoanHistoryCoMaker() {
    const email = this.tokenService.userEmailToken(
      this.tokenService.decodeToken()
    );
    const url = `${API_URL}/loanApplication/loanHistoryCoMaker/${email}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        this.setLoanHistory(res.message);
      },
      error: (error) =>
        console.log('An error occurred while fetching loan history'),
    });
  }

  initOfficeStatus() {
    const applicantId = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );
    const url = `${API_URL}/loanApplication/officeStatus/${applicantId}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        this._officeStatus.next(res || []);
      },
      error: (error) =>
        console.log('An error occurred while fetching office status'),
    });
  }

  initOfficeStatusCoMaker() {
    const email = this.tokenService.userEmailToken(
      this.tokenService.decodeToken()
    );
    const url = `${API_URL}/loanApplication/officeStatusCoMaker/${email}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        this._officeStatus.next(res || []);
      },
      error: (error) =>
        console.log('An error occurred while fetching office status'),
    });
  }

  initCurrentLoan() {
    const applicantId = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );
    const url = `${API_URL}/loanApplication/allPendingApplications/${applicantId}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        this._currentLoanStatus.next(res.message);
      },
      error: (error) =>
        console.log('An error occurred while fetching current loan status'),
    });
  }

  initCoMakersCurrentLoan() {
    const email = this.tokenService.userEmailToken(
      this.tokenService.decodeToken()
    );

    const url = `${API_URL}/loanApplication/allPendingCoMakerApplication/${email}`;

    return this.http.get<any>(url).subscribe({
      next: (res) => {
        this._currentLoanStatus.next(res.message);
      },
      error: (error) =>
        console.log('An error occurred while fetching current loan status'),
    });
  }

  initBorrowersInformation(application_id: number) {
    const url = `${API_URL}/loanApplication/getBorrowersInformation/${application_id}`;

    return this.http.get<any>(url);
  }

  initCoMakersInformation(application_id: number) {
    const url = `${API_URL}/loanApplication/getCoMakersInformation/${application_id}`;

    return this.http.get<any>(url);
  }

  initLoanDetailsInformation(application_id: number) {
    const url = `${API_URL}/loanApplication/getLoanDetailsById/${application_id}`;

    return this.http.get<any>(url);
  }

  setLoanStatus(data: LoanStatus) {
    this._loanApplicationStatus.next(data);
  }

  setCurrentLoanApplication(data: CurrentLoanApplication) {
    this._currentLoanApplication.next(data);
  }

  setLoanHistory(data: LoanHistory[]) {
    this._loanHistory.next(data);
  }
}
