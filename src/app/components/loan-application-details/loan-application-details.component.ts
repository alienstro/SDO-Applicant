import { Component } from '@angular/core';
import { StepperEndComponent } from '../../common/stepper-end/stepper-end.component';
import { StepperComponent } from '../../common/stepper/stepper.component';
import { LoanApplicationService } from '../../service/loan-application.service';
import { CurrentLoanStatus, OfficeStatus } from '../../interface';
import { TitleViewComponent } from '../../common/titleview/titleview.component';

@Component({
  selector: 'app-loan-application-details',
  standalone: true,
  imports: [StepperComponent, StepperEndComponent, TitleViewComponent],
  templateUrl: './loan-application-details.component.html',
  styleUrls: ['./loan-application-details.component.scss'],
})
export class LoanApplicationDetailsComponent {
  officeStatus: OfficeStatus[] = [];
  currentLoanStatus: CurrentLoanStatus = {
    currentLoan: null,
    currentHistory: null,
  };

  constructor(private loanApplicationDetails: LoanApplicationService) {
    this.loanApplicationDetails.officeStatus$.subscribe((res) => {
      this.officeStatus = res;
    });

    this.loanApplicationDetails.currentLoanStatus$.subscribe((res) => {
      this.currentLoanStatus = res;
    });
  }

  /**
   * Returns true if the named office (or all in a group) is done.
   */
  isOfficeDone(officeName: string | string[]): boolean {
    if (!this.officeStatus || this.officeStatus.length === 0) {
      return false;
    }

    if (Array.isArray(officeName)) {
      const names = officeName.map((n) => n.toLowerCase());
      const entries = this.officeStatus.filter((e) =>
        names.includes(e.department_name.toLowerCase())
      );
      return (
        entries.length > 0 &&
        entries.every((e) => e.status.toLowerCase() !== 'pending')
      );
    } else {
      const entry = this.officeStatus.find(
        (e) => e.department_name.toLowerCase() === officeName.toLowerCase()
      );
      return entry ? entry.status.toLowerCase() !== 'pending' : false;
    }
  }

  /**
   * Fetches the first updated_at for any of the given offices, formatted.
   */
  fetchUpdateDate(offices: string[]): string {
    if (!this.officeStatus || this.officeStatus.length === 0) return '';
    const names = offices.map((n) => n.toLowerCase());
    const entry = this.officeStatus.find((e) =>
      names.includes(e.department_name.toLowerCase())
    );
    return entry && entry.updated_at ? this.formatDate(entry.updated_at) : '';
  }

  public formatDate(dateString: string): string {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
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
    ][d.getMonth()];
    return `${mon}/${day}/${d.getFullYear()}`;
  }

  /**
   * Walks the phases in order and returns the appropriate header text
   */
  getCurrentPhaseRemark(): string {
    const phases: { key: string | string[]; label: string }[] = [
      // { key: 'application_date', label: 'Loan Submitted' },  ← delete this line
      { key: 'osds', label: 'For OSDS' },
      { key: 'accounting', label: 'For Accounting' },
      { key: 'secretariat', label: 'For Assessment' },
      { key: ['hr', 'admin', 'legal'], label: 'For Signature' },
      { key: ['sds', 'asds'], label: 'For Endorsement' },
      { key: 'payment', label: 'For Payment' },
    ];

    for (const phase of phases) {
      if (!this.isOfficeDone(phase.key)) {
        return phase.label;
      }
    }
    return 'Completed';
  }
}
