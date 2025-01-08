import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RequestService } from './request.service';
import { LoanApplication, LoanStatus } from '../interface';
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

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) {
    this.initLoanStatus()

  }

  initLoanStatus() {
    this.requestService.get<LoanStatus>('loanApplicationStatus').subscribe({
      next: res => {
        console.log('fetching status: ', res.message)
        this.setLoanStatus(res.message)
        console.log(this._loanApplicationStatus.getValue())
      }
        ,
      error: error =>
        this.snackbarService.showSnackbar('An error occured while fetching loan application status')
    })
  }

  setLoanStatus(data: LoanStatus) {
    this._loanApplicationStatus.next(data)
  }
}
