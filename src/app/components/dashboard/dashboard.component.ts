import { Component } from '@angular/core';
import { LoanApplicationService } from '../../service/loan-application.service';
import { LoanApplication, LoanHistory, LoanStatus } from '../../interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  isLoanStatusLoading = false
  currentLoanApplicationStatus!: LoanStatus

  isLoanHistoryLoading = false
  loanHistory!: LoanHistory[]


  constructor(private loanApplicationService: LoanApplicationService) {
    this.isLoanStatusLoading = true
    this.isLoanHistoryLoading = true

    this.loanApplicationService.loanApplicationStatus$.subscribe(res => {
      this.currentLoanApplicationStatus = res
      this.isLoanStatusLoading = false
      console.log(this.currentLoanApplicationStatus)
    })

    this.loanApplicationService.loanHistory$.subscribe(res => {

      this.loanHistory = res
      this.isLoanHistoryLoading = false
    })

  }


  formatPhp(amount: string) {

    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'PHP' }).format(
      parseFloat(amount),
    )
  }

}
