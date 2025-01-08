import { Component } from '@angular/core';
import { LoanApplicationService } from '../../service/loan-application.service';
import { LoanApplication, LoanStatus } from '../../interface';

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

  constructor(private loanApplicationService: LoanApplicationService) {
    this.isLoanStatusLoading = true
    this.loanApplicationService.loanApplicationStatus$.subscribe(res => {
      this.currentLoanApplicationStatus = res
      this.isLoanStatusLoading = false
      console.log(this.currentLoanApplicationStatus)
    })
  }
}
