import { Component, OnInit } from '@angular/core';
import { StepperComponent } from '../../common/stepper/stepper.component';
import { StepperEndComponent } from '../../common/stepper-end/stepper-end.component';
import { CommonModule } from '@angular/common';
import {
  CurrentLoanApplication,
  CurrentLoanStatus,
  LoanHistory,
  LoanStatus,
  OfficeStatus,
} from '../../interface';
import { LoanApplicationService } from '../../service/loan-application.service';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ComakerDialogComponent } from '../comaker-dialog/comaker-dialog.component';

@Component({
  selector: 'app-pending-application',
  standalone: true,
  imports: [
    StepperComponent,
    StepperEndComponent,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './pending-application.component.html',
  styleUrl: './pending-application.component.scss',
})
export class PendingApplicationComponent implements OnInit {
  officeStatus: OfficeStatus[] = [];
  currentLoanStatusList: CurrentLoanStatus[] = [];

  // Loan Status
  isLoanStatusLoading = false;
  currentLoanApplicationStatus: LoanStatus | null = null;

  // Loan History
  isLoanHistoryLoading = false;
  loanHistory!: LoanHistory[];

  // Current Loan Application
  isCurrentLoanLoading = false;
  currentLoanApplication: CurrentLoanApplication | null = null;

  // ROUTER
  private routerSub!: Subscription;
  private currentLoanSub!: Subscription;

  //
  constructor(
    private loanApplicationDetails: LoanApplicationService,
    private loanApplicationService: LoanApplicationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loanApplicationDetails.officeStatus$.subscribe((res) => {
      this.officeStatus = res;
    });

    this.loanApplicationDetails.currentLoanStatus$.subscribe((res) => {
      if (Array.isArray(res)) {
        this.currentLoanStatusList = res
          .filter((r) => r.currentLoan)
          .sort(
            (a, b) =>
              b.currentLoan.application_id - a.currentLoan.application_id
          );
      } else {
        this.currentLoanStatusList = res.currentLoan ? [res] : [];
      }

      console.log(this.currentLoanStatusList);
    });
  }

  // FETCHING OF DATA IN BACKEND
  ngOnInit(): void {
    // EVERY NAVIGATE TO THIS PAGE WILL FETCH
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.fetchLoanApplicationStatus();
        this.fetchLoanHistory();
      });

    this.fetchLoanApplicationStatus();
    this.fetchLoanHistory();
    this.loanApplicationService.initOfficeStatusCoMaker();
    this.loanApplicationService.initCoMakersCurrentLoan();

    this.currentLoanSub =
      this.loanApplicationService.currentLoanApplication$.subscribe((res) => {
        this.currentLoanApplication = null;
        this.currentLoanApplication = res;
      });

    throw new Error('Method not implemented.');
  }

  openCoMakerDialog(application_id: string) {
    const dialogRef = this.dialog.open(ComakerDialogComponent, {
      height: '50rem',
      width: '900rem',
      data: { application_id: application_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.fetchLoanApplicationStatus();
        this.fetchLoanHistory();
        this.loanApplicationService.initOfficeStatusCoMaker();
        this.loanApplicationService.initCoMakersCurrentLoan();
      }
    });
  }

  // PROGRESS OF THE LOAN APPLICATION
  isOfficeDone(officeName: string | string[], applicationId: any): boolean {
    const filteredStatus = this.officeStatus.filter(
      (e) => e.application_id.toString() === applicationId.toString()
    );

    if (!filteredStatus || filteredStatus.length === 0) {
      return false;
    }

    if (Array.isArray(officeName)) {
      const names = officeName.map((n) => n.toLowerCase());
      const entries = filteredStatus.filter((e) =>
        names.includes(e.department_name.toLowerCase())
      );
      return (
        entries.length > 0 &&
        entries.every((e) => e.status.toLowerCase() !== 'pending')
      );
    } else {
      const entry = filteredStatus.find(
        (e) => e.department_name.toLowerCase() === officeName.toLowerCase()
      );
      return entry ? entry.status.toLowerCase() !== 'pending' : false;
    }
  }

  // DATE FORMAT
  fetchUpdateDate(offices: string[], applicationId: any): string {
    const filteredStatus = this.officeStatus.filter(
      (e) => e.application_id.toString() === applicationId.toString()
    );

    if (!filteredStatus || filteredStatus.length === 0) return '';

    const names = offices.map((n) => n.toLowerCase());
    const entries = filteredStatus.filter(
      (e) =>
        e.department_name && names.includes(e.department_name.toLowerCase())
    );

    if (entries.length === 0) return '';

    const latest = entries.reduce((prev, curr) => {
      const prevDate = prev.updated_at
        ? new Date(prev.updated_at)
        : new Date(0);
      const currDate = curr.updated_at
        ? new Date(curr.updated_at)
        : new Date(0);
      return prevDate > currDate ? prev : curr;
    });

    return latest.updated_at ? this.formatDate(latest.updated_at) : '';
  }

  // GETTING THE LABEL FOR EACH OFFICE FOR PROGRESS
  getCurrentPhaseRemark(applicationId: any): string {
    const phases = [
      { key: 'osds', label: 'For OSDS' },
      { key: 'accounting', label: 'For Accounting' },
      { key: 'secretariat', label: 'For Assessment' },
      { key: ['hr', 'admin', 'legal'], label: 'For Signature' },
      { key: ['sds', 'asds'], label: 'For Endorsement' },
      { key: 'payment', label: 'For Payment' },
    ];

    for (const phase of phases) {
      if (!this.isOfficeDone(phase.key, applicationId)) {
        return phase.label;
      }
    }
    return 'Completed';
  }

  // FORMATING DATE INTO MEDIUM FORMAT
  public formatDate(dateString: string): string {
    const d = new Date(dateString);
    const day = String(d.getUTCDate()).padStart(2, '0');
    const mon = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][d.getUTCMonth()];
    return `${mon}/${day}/${d.getUTCFullYear()}`;
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.currentLoanSub) this.currentLoanSub.unsubscribe();
  }

  // FETCHING LOAN APPLICATION STATUS IN BACKEND
  fetchLoanApplicationStatus() {
    this.isLoanStatusLoading = true;
    this.loanApplicationService.initLoanStatusCoMaker();
    this.loanApplicationService.loanApplicationStatus$.subscribe((res) => {
      this.currentLoanApplicationStatus = null;
      this.currentLoanApplicationStatus = res;
      this.isLoanStatusLoading = false;
      // console.log(this.currentLoanApplicationStatus);
    });
  }

  // FETCHING LOAN HISTORY IN BACKEND
  fetchLoanHistory() {
    this.isLoanHistoryLoading = true;
    this.loanApplicationService.initLoanHistoryCoMaker();
    this.loanApplicationService.loanHistory$.subscribe((res) => {
      this.loanHistory = [];
      this.loanHistory = res;
      this.isLoanHistoryLoading = false;
    });
  }

  // FORMAT OF CURRENCY
  formatPhp(amount: string) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'PHP',
    }).format(parseFloat(amount));
  }
}
