import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoanApplicationService } from '../../service/loan-application.service';
import {
  LoanHistory,
  LoanStatus,
  CurrentLoanApplication,
} from '../../interface';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LoanApplicationDetailsComponent } from '../loan-application-details/loan-application-details.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LoanApplicationDetailsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Loan Status
  isLoanStatusLoading = false;
  currentLoanApplicationStatus: LoanStatus | null = null;

  // Loan History
  isLoanHistoryLoading = false;
  loanHistory!: LoanHistory[];

  // Current Loan Application
  isCurrentLoanLoading = false;
  currentLoanApplication: CurrentLoanApplication | null = null;

  private routerSub!: Subscription;
  private currentLoanSub!: Subscription;

  constructor(
    private loanApplicationService: LoanApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.fetchLoanApplicationStatus();
        this.fetchLoanHistory();
      });

    this.fetchLoanApplicationStatus();
    this.fetchLoanHistory();
    // this.loanApplicationService.initCurrentLoanApplication();
    this.loanApplicationService.initOfficeStatus();
    this.loanApplicationService.initCurrentLoan();

    this.currentLoanSub =
      this.loanApplicationService.currentLoanApplication$.subscribe((res) => {
        this.currentLoanApplication = null;
        this.currentLoanApplication = res;
        console.log('Current Loan Application Updated:', res);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.currentLoanSub) this.currentLoanSub.unsubscribe();
  }

  fetchLoanApplicationStatus() {
    this.isLoanStatusLoading = true;
    this.loanApplicationService.initLoanStatus();
    this.loanApplicationService.loanApplicationStatus$.subscribe((res) => {
      this.currentLoanApplicationStatus = null;
      this.currentLoanApplicationStatus = res;
      this.isLoanStatusLoading = false;
    });
  }

  fetchLoanHistory() {
    this.isLoanHistoryLoading = true;
    this.loanApplicationService.initLoanHistory();
    this.loanApplicationService.loanHistory$.subscribe((res) => {
      this.loanHistory = [];
      this.loanHistory = res;
      this.isLoanHistoryLoading = false;
    });
  }

  formatPhp(amount: string) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'PHP',
    }).format(parseFloat(amount));
  }
}
