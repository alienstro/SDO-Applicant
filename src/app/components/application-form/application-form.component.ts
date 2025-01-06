import { Component, inject } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RequestService } from '../../service/request.service';
import {MatRadioModule} from '@angular/material/radio';
import { Information, LoanApplication, LoanDetails } from '../../interface';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss'
})
export class ApplicationFormComponent {

  constructor(private requestService: RequestService) {}

  purposeArr = [
    "Hospitalization/Medical",
    "Long Medication/Rehabilitation",
    "House Repairs/Equity",
    "House Repair - Major",
    "House Repair - Minor",
    "Payment of Loans from Private Institution",
    "Calamity"
  ]

  loanDetailsForm = new FormGroup({
    loanAmount: new FormControl(0),
    loanNumber: new FormControl(''),
    purpose: new FormControl(''),
    term: new FormControl(0),
    loanType: new FormControl('')
  })

  borrowerInfoForm = new FormGroup({
    lastName: new FormControl(''),
    firstname: new FormControl(''),
    middleName: new FormControl(''),
    region: new FormControl(''),
    province: new FormControl(''),
    city: new FormControl(''),
    barangay: new FormControl(''),
    street: new FormControl(''),
    zipcode: new FormControl(''),
    employeeNo: new FormControl(''),
    employeeStatus: new FormControl(''),
    birth: new FormControl(new Date()),
    age: new FormControl(0),
    office: new FormControl(''),
    salary: new FormControl(''),
    officeTelNo: new FormControl(''),
    yearService: new FormControl(0),
    mobileNo: new FormControl(''),
  })

  comakerInfoForm = new FormGroup({
    lastName: new FormControl(''),
    firstname: new FormControl(''),
    middleName: new FormControl(''),
    region: new FormControl(''),
    province: new FormControl(''),
    city: new FormControl(''),
    barangay: new FormControl(''),
    street: new FormControl(''),
    zipcode: new FormControl(''),
    employeeNo: new FormControl(''),
    employeeStatus: new FormControl(''),
    birth: new FormControl(new Date()),
    age: new FormControl(0),
    office: new FormControl(''),
    salary: new FormControl(''),
    officeTelNo: new FormControl(''),
    yearService: new FormControl(0),
    mobileNo: new FormControl(''),
  })


  isLinear = false;

  parseForm() {
    const applicationForm: LoanApplication = {
      loanDetails: this.loanDetailsForm.getRawValue() as LoanDetails,
      borrowerInfo: this.borrowerInfoForm.getRawValue() as Information,
      comakerInfo: this.comakerInfoForm.getRawValue() as Information,
    }

    return applicationForm
  }

  onSubmit() {
    this.requestService.post(this.parseForm(), 'loanForm').subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    })
  }
}
