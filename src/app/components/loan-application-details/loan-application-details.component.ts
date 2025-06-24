import { Component } from '@angular/core';
import { StepperEndComponent } from '../../common/stepper-end/stepper-end.component';
import { StepperComponent } from '../../common/stepper/stepper.component';
import { LoanApplicationService } from '../../service/loan-application.service';
import { CurrentLoanStatus, OfficeStatus } from '../../interface';
import { TitleViewComponent } from '../../common/titleview/titleview.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-application-details',
  standalone: true,
  imports: [
    StepperComponent,
    StepperEndComponent,
    TitleViewComponent,
    CommonModule,
  ],
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
}
