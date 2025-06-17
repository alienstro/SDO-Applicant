import { Component } from '@angular/core';
import { StepperEndComponent } from '../../common/stepper-end/stepper-end.component';
import { StepperComponent } from '../../common/stepper/stepper.component';
import { LoanApplicationService } from '../../service/loan-application.service';
import { CurrentLoan, CurrentLoanStatus, OfficeStatus } from '../../interface';
import { TitleViewComponent } from '../../common/titleview/titleview.component';

@Component({
  selector: 'app-loan-application-details',
  standalone: true,
  imports: [StepperComponent, StepperEndComponent, TitleViewComponent],
  templateUrl: './loan-application-details.component.html',
  styleUrl: './loan-application-details.component.scss',
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

      console.log('HERE: ', this.currentLoanStatus);
    });

    this.loanApplicationDetails.officeStatus$.subscribe((res) => {
      console.log('Office status:', res); 
      this.officeStatus = res;
    });
  }

  // isOfficeDone(officeName: string | string[]) {

  //   if (Array.isArray(officeName)) {
  //     // Filter the entries that belong to the group
  //     const groupEntries = this.officeStatus.filter(entry =>
  //       officeName.includes(entry.department_name)
  //     );

  //     // Check if all offices in the group are not "Pending"
  //     const allDone = groupEntries.every(entry => entry.status !== "Pending");

  //     return allDone;
  //   } else {

  //     // Find the specific office by name
  //     const office = this.officeStatus.find(
  //       (entry) => entry.department_name.toLowerCase() === officeName.toLowerCase()
  //     );

  //     // If office is found, check if its status is not "Pending"
  //     if (office) {
  //       return office.status !== "Pending";
  //     }

  //     // If office is not found, return false or handle it as needed
  //     return false;
  //   }
  // }

  isOfficeDone(officeName: string | string[]): boolean {
    if (!this.officeStatus || this.officeStatus.length === 0) {
      console.log("No officeStatus")
      return false;
    }

    if (Array.isArray(officeName)) {
      const lowerCaseOffices = officeName.map((name) => name.toLowerCase());

      const groupEntries = this.officeStatus.filter((entry) =>
        lowerCaseOffices.includes(entry.department_name.toLowerCase())
      );

      return (
        groupEntries.length > 0 &&
        groupEntries.every((entry) => entry.status.toLowerCase() !== 'pending')
      );
    } else {
      const office = this.officeStatus.find(
        (entry) =>
          entry.department_name.toLowerCase() === officeName.toLowerCase()
      );

      return office ? office.status.toLowerCase() !== 'pending' : false;
    }
  }

  isGroupDone(groupOffices: string[]) {
    // Filter the entries that belong to the group
    const groupEntries = this.officeStatus.filter((entry) =>
      groupOffices.includes(entry.department_name)
    );

    // Check if all offices in the group are not "Pending"
    const allDone = groupEntries.every((entry) => entry.status !== 'Pending');

    return allDone;
  }

  // fetchUpdateDate(offices: string[]) {

  //   if (!this.officeStatus) return null
  //   // Filter the entries that match the office or group of offices
  //   const filteredEntries = this.officeStatus.find(entry => offices.includes(entry.department_name.toLowerCase()))!;

  //   const date = filteredEntries ? filteredEntries.updated_at : ''

  //   if (!date) return ''

  //   return this.formatDate(date)
  // }

  fetchUpdateDate(offices: string[]): string {
    if (!this.officeStatus || this.officeStatus.length === 0) return '';

    const lowerCaseOffices = offices.map((o) => o.toLowerCase());

    const entry = this.officeStatus.find((entry) =>
      lowerCaseOffices.includes(entry.department_name.toLowerCase())
    );

    return entry?.updated_at ? this.formatDate(entry.updated_at) : '';
  }

  formatDate(dateString: string) {
    const dateObject = new Date(dateString);

    const day = String(dateObject.getDate()).padStart(2, '0');
    const monthNames = [
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
    ];
    const month = monthNames[dateObject.getMonth()]; // Get the abbreviated month name
    const year = dateObject.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  }
}
