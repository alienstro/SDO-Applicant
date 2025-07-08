import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { BehaviorSubject } from 'rxjs';
import {
  CurrentLoanApplication,
  FileUpload,
  LoanApplication,
} from '../../interface';
import { AddressService } from '../../service/address.service';
import { LoanApplicationService } from '../../service/loan-application.service';
import { RequestService } from '../../service/request.service';
import { SnackbarService } from '../../service/snackbar.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { TokenService } from '../../service/token.service';
import { ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

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
    MatRadioModule,
    CommonModule,
    FileUploadComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
})
export class ApplicationFormComponent {
  @ViewChild('appStepper') stepper!: MatStepper;

  isCurrentLoanApplicationLoading = false;
  isloanPending = false;
  CurrentLoanApplication!: CurrentLoanApplication;
  fileFormData: FormData = new FormData();
  municipalities: { [id: string]: string[] };
  regions: { [id: string]: string[] };
  applicantId: number = 0;
  // requiredDocuments = false

  private _requiredDocuments = new BehaviorSubject<{ [key: string]: boolean }>({
    idComaker: false,
    idApplicant: false,
    authorityToDeduct: false,
    payslipApplicant: false,
    payslipComaker: false,
  });

  requiredDocuments$ = this._requiredDocuments.asObservable();

  isDocumentValid = false;
  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService,
    private loanApplicationService: LoanApplicationService,
    private addressService: AddressService,
    private tokenService: TokenService
  ) {
    this.applicantId = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );
    this.isCurrentLoanApplicationLoading = true;
    this.loanApplicationService.currentLoanApplication$.subscribe((res) => {
      this.CurrentLoanApplication = res;
      this.isCurrentLoanApplicationLoading = false;
      this.parseApplicationForm();
    });

    this.requiredDocuments$.subscribe((res) => {
      this.isDocumentValid = Object.values(res).every(
        (value) => value === true
      );
      console.log(this.isDocumentValid);
    });

    this.regions = addressService.region;
    this.municipalities = addressService.municipalities;
  }

  purposeArr = [
    'Hospitalization/Medical',
    'Long Medication/Rehabilitation',
    'House Repairs/Equity',
    'House Repair - Major',
    'House Repair - Minor',
    'Payment of Loans from Private Institution',
    'Calamity',
    
  ];

  loanDetailsForm = new FormGroup({
    loanAmount: new FormControl(0, [Validators.required]),
    loanNumber: new FormControl('', [Validators.required]),
    purpose: new FormControl('', [Validators.required]),
    otherPurpose: new FormControl(''),
    term: new FormControl(0, [Validators.required]),
    loanType: new FormControl('', [Validators.required]),
  });

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
    salary: new FormControl(0, [Validators.required]),
    officeTelNo: new FormControl('', [Validators.required]),
    yearService: new FormControl(0, [Validators.required]),
    mobileNo: new FormControl('', [Validators.required]),
  });

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
    salary: new FormControl(0, [Validators.required]),
    officeTelNo: new FormControl('', [Validators.required]),
    yearService: new FormControl(0, [Validators.required]),
    mobileNo: new FormControl('', [Validators.required]),
  });

  isLinear = true;

  isEditing = false;

  parseApplicationForm() {
    if (!this.CurrentLoanApplication.ongoingApplication) return;

    if (
      this.CurrentLoanApplication.ongoingApplication &&
      !this.CurrentLoanApplication.isEditable
    ) {
      this.isloanPending = true;
      return;
    }

    const currentLoan = this.CurrentLoanApplication
      .applicationDetails as LoanApplication;

    this.loanDetailsForm.patchValue({
      loanAmount: currentLoan.loanDetails.loanAmount,
      loanNumber: currentLoan.loanDetails.loanNumber,
      purpose: currentLoan.loanDetails.purpose,
      otherPurpose: '',
      term: currentLoan.loanDetails.term,
      loanType: currentLoan.loanDetails.loanType,
    });

    this.borrowerInfoForm.patchValue({
      lastName: currentLoan.borrowerInfo.lastName,
      firstname: currentLoan.borrowerInfo.firstname,
      middleName: currentLoan.borrowerInfo.middleName,
      region: currentLoan.borrowerInfo.region,
      province: currentLoan.borrowerInfo.province,
      city: currentLoan.borrowerInfo.city,
      barangay: currentLoan.borrowerInfo.barangay,
      street: currentLoan.borrowerInfo.street,
      zipcode: currentLoan.borrowerInfo.zipcode,
      employeeNo: currentLoan.borrowerInfo.employeeNo,
      employeeStatus: currentLoan.borrowerInfo.employeeStatus,
      birth: currentLoan.borrowerInfo.birth,
      age: currentLoan.borrowerInfo.age,
      office: currentLoan.borrowerInfo.office,
      salary: currentLoan.borrowerInfo.salary,
      officeTelNo: currentLoan.borrowerInfo.officeTelNo,
      yearService: currentLoan.borrowerInfo.yearService,
      mobileNo: currentLoan.borrowerInfo.mobileNo,
    });

    this.comakerInfoForm.patchValue({
      lastName: currentLoan.borrowerInfo.lastName,
      firstname: currentLoan.borrowerInfo.firstname,
      middleName: currentLoan.borrowerInfo.middleName,
      region: currentLoan.borrowerInfo.region,
      province: currentLoan.borrowerInfo.province,
      city: currentLoan.borrowerInfo.city,
      barangay: currentLoan.borrowerInfo.barangay,
      street: currentLoan.borrowerInfo.street,
      zipcode: currentLoan.borrowerInfo.zipcode,
      employeeNo: currentLoan.borrowerInfo.employeeNo,
      employeeStatus: currentLoan.borrowerInfo.employeeStatus,
      birth: currentLoan.borrowerInfo.birth,
      age: currentLoan.borrowerInfo.age,
      office: currentLoan.borrowerInfo.office,
      salary: currentLoan.borrowerInfo.salary,
      officeTelNo: currentLoan.borrowerInfo.officeTelNo,
      yearService: currentLoan.borrowerInfo.yearService,
      mobileNo: currentLoan.borrowerInfo.mobileNo,
    });

    this.isEditing = true;
  }

  purposeChange(type: string) {
    if (type === 'main') {
      this.loanDetailsForm.patchValue({
        otherPurpose: '',
      });
      console.log('asdsd');
    } else if (type === 'other') {
      console.log('asdsd');
      this.loanDetailsForm.get('purpose')?.setValue('Others (specify)');
    }
  }

  parseForm() {
    const applicantionFormdata = new FormData();

    applicantionFormdata.append(
      'loanDetails',
      JSON.stringify(this.loanDetailsForm.getRawValue())
    );
    applicantionFormdata.append(
      'borrowerInfo',
      JSON.stringify(this.borrowerInfoForm.getRawValue())
    );
    applicantionFormdata.append(
      'comakerInfo',
      JSON.stringify(this.comakerInfoForm.getRawValue())
    );
    applicantionFormdata.append(
      'applicantId',
      JSON.stringify(this.applicantId)
    );

    // const applicationForm: LoanApplication = {
    //   loanDetails: this.loanDetailsForm.getRawValue() as LoanDetails,
    //   borrowerInfo: this.borrowerInfoForm.getRawValue() as Information,
    //   comakerInfo: this.comakerInfoForm.getRawValue() as Information,
    // }

    return applicantionFormdata;
  }

  private parseMessage(words: string[]) {
    let message = '';

    if (words.length < 2) {
      message = `Recheck ${words} input`;
    } else if (words.length < 4) {
      message = `Recheck  ${words} inputs`;
    } else {
      message = `Some inputs are invalid`;
    }

    this.snackbarService.showSnackbar(message);
  }

  findInvalidControls(formGroup: FormGroup) {
    let invalidControls: string[] = [];

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control && control.invalid) {
        invalidControls.push(key);
      }
    });

    if (invalidControls.length < 1) return;

    invalidControls = invalidControls.map(
      (item) =>
        ' ' +
        String(item).charAt(0).toUpperCase() +
        String(item)
          .slice(1)
          .replace(/(?<!^)([A-Z])/g, ' $1')
    );

    this.parseMessage(invalidControls);
  }

  handleFileUpload(event: FileUpload) {
    if (this.fileFormData.has(event.idLabel)) {
      this.fileFormData.set(event.idLabel, event.file);
    } else {
      this.fileFormData.append(event.idLabel, event.file);
    }

    let data = this._requiredDocuments.getValue();

    if (event.idLabel in data) {
      data = { ...data, [event.idLabel]: true };

      this._requiredDocuments.next(data);
    }
  }

  handleFileCancel(event: string) {
    if (this.fileFormData.has(event)) {
      this.fileFormData.delete(event);
    }

    let data = this._requiredDocuments.getValue();

    if (event in data) {
      data = { ...data, [event]: false };

      this._requiredDocuments.next(data);
    }
  }

  checkValidDocuments() {
    if (!this.isDocumentValid) {
      this.snackbarService.showSnackbar('Check all required documents!');
    }
  }

  fetchRegions() {
    return Object.keys(this.regions);
  }

  fetchProvince(region: string) {
    return this.regions[region];
  }

  fetchCity() {
    return Object.keys(this.municipalities);
  }

  fetchBarangay(city: string) {
    return this.municipalities[city];
  }

  onSubmit() {
    const applicationForm = this.parseForm() as any;

    // Append JSON fields to FormData
    for (const [key, value] of applicationForm.entries()) {
      this.fileFormData.append(key, value);
    }

    this.requestService.addLoanApplication(this.fileFormData).subscribe({
      next: (res) => {
        console.log(res);

        if (res.success) {
          this.snackbarService.showSnackbar(
            'Loan application submitted successfully!'
          );

          this.loanApplicationService.initCurrentLoanApplication();

          this.resetForm();
        } else {
          this.snackbarService.showSnackbar(
            'Failed to submit loan application. Please try again.'
          );
        }
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.showSnackbar(
          'An error occurred while submitting the application.'
        );
        console.log("An error occurred while submitting the application.")
      },
    });
  }

  resetForm() {
    this.loanDetailsForm.reset();
    this.borrowerInfoForm.reset();
    this.comakerInfoForm.reset();

    // Reset form defaults
    this.loanDetailsForm.patchValue({ loanAmount: 0, term: 0 });
    this.borrowerInfoForm.patchValue({ birth: new Date(), age: 0 });
    this.comakerInfoForm.patchValue({ birth: new Date(), age: 0 });

    // Reset stepper to first step
    if (this.stepper) {
      this.stepper.reset();
    }

    // Clear file uploads
    this.fileFormData = new FormData();

    // Reset required doc flags
    this._requiredDocuments.next({
      idComaker: false,
      idApplicant: false,
      authorityToDeduct: false,
      payslipApplicant: false,
      payslipComaker: false,
    });

    this.isDocumentValid = false;
    this.isEditing = false;
  }
}
