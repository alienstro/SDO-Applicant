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
  styleUrl: './loan-application-details.component.scss'
})
export class LoanApplicationDetailsComponent {

  officeStatus: OfficeStatus[] = []
  currentLoanStatus: CurrentLoanStatus = {
    currentLoan: {
      application_id: "",
      application_date: "",
      status: ""
    },
    currentHistory: {
      application_history_id: "",
      application_id: "",
      remarks: "",
      history_date: "",
      initiator: ""
    }
  }
  constructor(private loanApplicationDetails: LoanApplicationService) {
    this.loanApplicationDetails.officeStatus$.subscribe(res => {
      this.officeStatus = res
    })

    this.loanApplicationDetails.currentLoanStatus$.subscribe(res => {
      this.currentLoanStatus = res
    })

  }

  isOfficeDone(officeName: string | string[]) {

    if (Array.isArray(officeName)) {
      // Filter the entries that belong to the group
      const groupEntries = this.officeStatus.filter(entry =>
        officeName.includes(entry.office_name)
      );

      // Check if all offices in the group are not "Pending"
      const allDone = groupEntries.every(entry => entry.status !== "Pending");

      return allDone;
    } else {

      // Find the specific office by name
      const office = this.officeStatus.find(
        (entry) => entry.office_name.toLowerCase() === officeName.toLowerCase()
      );

      // If office is found, check if its status is not "Pending"
      if (office) {
        return office.status !== "Pending";
      }

      // If office is not found, return false or handle it as needed
      return false;
    }
  }



  isGroupDone(groupOffices: string[]) {
    // Filter the entries that belong to the group
    const groupEntries = this.officeStatus.filter(entry =>
      groupOffices.includes(entry.office_name)
    );

    // Check if all offices in the group are not "Pending"
    const allDone = groupEntries.every(entry => entry.status !== "Pending");

    return allDone;
  }

  fetchUpdateDate(offices: string[]) {

    if (!this.officeStatus) return null
    // Filter the entries that match the office or group of offices
    const filteredEntries = this.officeStatus.find(entry => offices.includes(entry.office_name.toLowerCase()))!;

    const date = filteredEntries.updated_at ? filteredEntries.updated_at : ''

    if (!date) return ''

    return this.formatDate(date)
  }

  formatDate(dateString: string) {
    const dateObject = new Date(dateString);

    const day = String(dateObject.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[dateObject.getMonth()]; // Get the abbreviated month name
    const year = dateObject.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate
  }
}
