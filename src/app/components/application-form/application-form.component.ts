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
import { SnackbarService } from '../../service/snackbar.service';

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

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) {}

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
    loanAmount: new FormControl(0, [Validators.required]),
    loanNumber: new FormControl('', [Validators.required]),
    purpose: new FormControl('', [Validators.required]),
    otherPurpose: new FormControl(''),
    term: new FormControl(0, [Validators.required]),
    loanType: new FormControl('', [Validators.required])
  })

  borrowerInfoForm = new FormGroup({
    lastName: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    region: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    barangay: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [Validators.required]),
    employeeNo: new FormControl('', [Validators.required]),
    employeeStatus: new FormControl('', [Validators.required]),
    birth: new FormControl(new Date(), [Validators.required]),
    age: new FormControl(0),
    office: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    officeTelNo: new FormControl('', [Validators.required]),
    yearService: new FormControl(0, [Validators.required]),
    mobileNo: new FormControl('' , [Validators.required]),
  })
  comakerInfoForm = new FormGroup({
    lastName: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    region: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    barangay: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [Validators.required]),
    employeeNo: new FormControl('', [Validators.required]),
    employeeStatus: new FormControl('', [Validators.required]),
    birth: new FormControl(new Date(), [Validators.required]),
    age: new FormControl(0),
    office: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    officeTelNo: new FormControl('', [Validators.required]),
    yearService: new FormControl(0, [Validators.required]),
    mobileNo: new FormControl('' , [Validators.required]),
  })

  isLinear = true;

  purposeChange(type: string) {
    if(type === 'main') {
      this.loanDetailsForm.patchValue({
        otherPurpose: ''
      })
      console.log('asdsd')
    } else if(type === 'other') {
      console.log('asdsd')
      this.loanDetailsForm.get('purpose')?.setValue("NA");
    }
  }

  parseForm() {
    const applicationForm: LoanApplication = {
      loanDetails: this.loanDetailsForm.getRawValue() as LoanDetails,
      borrowerInfo: this.borrowerInfoForm.getRawValue() as Information,
      comakerInfo: this.comakerInfoForm.getRawValue() as Information,
    }

    return applicationForm
  }

  private parseMessage(words: string[]) {
    let message = ''

    if(words.length < 2) {
      message = `Recheck ${words} is input`
    } else if(words.length < 4) {
      message = `Recheck  ${words}inputs`
    }else {
      message = `Some inputs are invalid`
    }

    this.snackbarService.showSnackbar(message)
  }

  findInvalidControls(formGroup: FormGroup) {

    let invalidControls: string[] = [];

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control && control.invalid) {
        invalidControls.push(key);
      }
    });

    if(invalidControls.length < 1) return

    // Format the control names
    invalidControls = invalidControls.map(item =>
      " "+String(item).charAt(0).toUpperCase()+String(item).slice(1).replace(/(?<!^)([A-Z])/g, ' $1'))

    this.parseMessage(invalidControls)
  }

  test() {
    this.findInvalidControls(this.loanDetailsForm)
  }

  onSubmit() {
    this.requestService.post(this.parseForm(), 'loanForm').subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    })
  }
}
