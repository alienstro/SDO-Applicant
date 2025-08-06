import { Component } from '@angular/core';
import { StepperEndComponent } from '../../common/stepper-end/stepper-end.component';
import { StepperComponent } from '../../common/stepper/stepper.component';
import { LoanApplicationService } from '../../service/loan-application.service';
import { CurrentLoanStatus, OfficeStatus } from '../../interface';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-loan-application-details',
  standalone: true,
  imports: [StepperComponent, StepperEndComponent, CommonModule, MatTabsModule],
  templateUrl: './loan-application-details.component.html',
  styleUrls: ['./loan-application-details.component.scss'],
})
export class LoanApplicationDetailsComponent {
  officeStatus: OfficeStatus[] = [];
  currentLoanStatusList: CurrentLoanStatus[] = [];

  constructor(private loanApplicationDetails: LoanApplicationService) {
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
    });
  }

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
      // console.log(
      //   '1',
      //   entries.every((e) => e.status.toLowerCase() !== 'pending')
      // );

      return (
        entries.length > 0 &&
        entries.every((e) => e.status.toLowerCase() !== 'pending')
      );
    } else {
      const entry = filteredStatus.find(
        (e) => e.department_name.toLowerCase() === officeName.toLowerCase()
      );
      // console.log(entry ? entry.status.toLowerCase() !== 'pending' : false);

      return entry ? entry.status.toLowerCase() !== 'pending' : false;
    }
  }

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

  getCurrentPhaseRemark(applicationId: any): string {
    const phases = [
      { key: ['HR', 'Legal', 'Admin'], label: 'For Signature' }, // 1,2,3
      { key: 'Accounting', label: 'For Accounting' }, // 4
      { key: ['ASDS'], label: 'For Endorsement' }, // 5,6
      { key: 'OSDS', label: 'For OSDS' }, // 7
      { key: 'Payment', label: 'For Payment' }, // 8
    ];

    for (const phase of phases) {
      if (!this.isOfficeDone(phase.key, applicationId)) {
        console.log('appliactionId: ', applicationId + phase.label);
        return phase.label;
      }
    }
    return 'Completed';
  }

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

  getCurrentApplicationPending(): boolean {
    return (
      this.currentLoanStatusList.filter(
        (ls) => ls.currentLoan && ls.currentLoan.status === 'Pending'
      ).length === 0
    );
  }

  getCurrentApplicationRejected(): boolean {
    return (
      this.currentLoanStatusList.filter(
        (ls) => ls.currentLoan && ls.currentLoan.status === 'Rejected'
      ).length === 0
    );
  }
  getCurrentApplicationApproved(): boolean {
    return (
      this.currentLoanStatusList.filter(
        (ls) => ls.currentLoan && ls.currentLoan.status === 'Paid'
      ).length === 0
    );
  }
}
