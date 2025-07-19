import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
} from '@angular/core';
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
  Information,
  LoanApplication,
  LoanDetails,
} from '../../interface';
import { AddressService } from '../../service/address.service';
import { LoanApplicationService } from '../../service/loan-application.service';
import { RequestService } from '../../service/request.service';
import { SnackbarService } from '../../service/snackbar.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { TokenService } from '../../service/token.service';
import { ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import SignaturePad from 'signature_pad';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comaker-dialog',
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
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './comaker-dialog.component.html',
  styleUrl: './comaker-dialog.component.scss',
})
export class ComakerDialogComponent implements OnInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('appStepper') stepper!: MatStepper;

  signaturePad: SignaturePad | null = null;

  isCurrentLoanApplicationLoading = false;
  isloanPending = false;
  CurrentLoanApplication!: CurrentLoanApplication;
  fileFormData: FormData = new FormData();
  municipalities: { [id: string]: string[] };
  regions: { [id: string]: string[] };
  applicantId: number = 0;
  borrowersInformation: Information[] = [];
  coMakersInformation: Information[] = [];
  loanDetailsInformation: LoanDetails[] = [];

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
    private tokenService: TokenService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ComakerDialogComponent>
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

    console.log('Dialog data:', this.data.application_id);
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    // size it however you like:
    canvas.width = 800;
    canvas.height = 300;

    this.signaturePad = new SignaturePad(canvas, {
      minWidth: 1,
      // backgroundColor: '#000000FF',
    });
    this.signaturePad.clear();

    this.cdr.detectChanges();
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageDataUrl = e.target?.result as string;
        this.loadImageToSignaturePad(imageDataUrl);
      };

      reader.readAsDataURL(file);
    }
  }

  loadImageToSignaturePad(imageDataUrl: string): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const image = new Image();
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.signaturePad?.fromDataURL(canvas.toDataURL());
      };
      image.src = imageDataUrl;
    }
  }

  clearSignature() {
    console.log(this.signaturePad?.toDataURL());

    this.signaturePad?.clear();
  }

  getSignatureDataURL(): string {
    if (!this.signaturePad) {
      return '';
    }
    return this.signaturePad.toDataURL();
  }

  onSubmits() {
    const sigData = this.getSignatureDataURL();
    this.fileFormData.append('signature', sigData);
  }

  populateFormWithSampleData() {
    this.comakerInfoForm.patchValue({
      lastName: 'Garcia',
      firstname: 'Maria',
      middleName: 'Cruz',
      region: 'REGION I (ILOCOS)',
      province: 'ILOCOS NORTE',
      city: 'BOTOLAN',
      barangay: 'Bangan',
      street: '456 Secondary Street',
      zipcode: '4030',
      position: 'Teacher II',
      employeeNo: '11111',
      employeeStatus: 'Co-Terminus',
      birth: new Date('1980-05-20'),
      age: 45,
      office: 'Los Baños High School',
      salary: 40000,
      officeTelNo: '234234324',
      yearService: 15,
      mobileNo: '09181234567',
    });

    console.log('Forms populated with sample data');
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
    position: new FormControl('', [Validators.required]),
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
    // email: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    region: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    barangay: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [Validators.required]),
    position: new FormControl('', [Validators.required]),
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

    this.loanDetailsForm.disable();

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
      position: currentLoan.borrowerInfo.position,
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

    this.borrowerInfoForm.disable();

    this.comakerInfoForm.patchValue({
      // email: currentLoan.comakerInfo.email,
      lastName: currentLoan.borrowerInfo.lastName,
      firstname: currentLoan.borrowerInfo.firstname,
      middleName: currentLoan.borrowerInfo.middleName,
      region: currentLoan.borrowerInfo.region,
      province: currentLoan.borrowerInfo.province,
      city: currentLoan.borrowerInfo.city,
      barangay: currentLoan.borrowerInfo.barangay,
      street: currentLoan.borrowerInfo.street,
      zipcode: currentLoan.borrowerInfo.zipcode,
      position: currentLoan.borrowerInfo.position,
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
      'comakerInfo',
      JSON.stringify(this.comakerInfoForm.getRawValue())
    );
    applicantionFormdata.append(
      'applicantId',
      JSON.stringify(this.applicantId)
    );
    const sigData = this.getSignatureDataURL();
    applicantionFormdata.append('signature', sigData);
    applicantionFormdata.append('applicationId', this.data.application_id);

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
    const applicationForm = {
      comakerInfo: JSON.stringify(this.comakerInfoForm.getRawValue()),
      applicantId: this.applicantId,
      signature: this.getSignatureDataURL(),
      applicationId: this.data.application_id,
    };

    this.requestService.addLoanApplicationCoMaker(applicationForm).subscribe({
      next: (res) => {
        console.log(res);

        if (res.success) {
          this.snackbarService.showSnackbar(
            'Loan application submitted successfully!'
          );

          this.dialogRef.close('refresh');
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
        console.log('An error occurred while submitting the application.');
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
    // this.comakerInfoForm.patchValue({ birth: new Date(), age: 0 });
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

  ngOnInit(): void {
    this.loanApplicationService
      .initLoanDetailsInformation(this.data.application_id)
      .subscribe((details: any) => {
        this.loanDetailsInformation = details;

        console.log('loandetails', this.loanDetailsInformation);

        this.loanDetailsForm.patchValue({
          loanAmount: details.loan_amount,
          loanNumber: details.loan_application_number,
          purpose: details.purpose,
          otherPurpose: details.other_purpose || '',
          term: details.term,
          loanType: details.type_of_loan,
        });
      });

    this.loanApplicationService
      .initBorrowersInformation(this.data.application_id)
      .subscribe((borrower: any) => {
        this.borrowersInformation = borrower;

        console.log(this.borrowersInformation);

        this.borrowerInfoForm.patchValue({
          lastName: borrower.last_name,
          firstname: borrower.first_name,
          middleName: borrower.middle_initial,
          region: borrower.region,
          province: borrower.province,
          city: borrower.city,
          barangay: borrower.barangay,
          street: borrower.street,
          zipcode: borrower.zipcode,
          position: borrower.position,
          employeeNo: borrower.employee_number,
          employeeStatus: borrower.employment_status,
          birth: borrower.date_of_birth,
          age: borrower.age,
          office: borrower.office,
          salary: borrower.monthly_salary,
          officeTelNo: borrower.office_tel_number,
          yearService: borrower.years_in_service,
          mobileNo: borrower.mobile_number,
        });
      });

    this.loanApplicationService
      .initCoMakersInformation(this.data.application_id)
      .subscribe((comaker: any) => {
        this.coMakersInformation = comaker;

        console.log(this.coMakersInformation);

        this.comakerInfoForm.patchValue({
          lastName: comaker.co_last_name,
          firstname: comaker.co_first_name,
          middleName: comaker.co_middle_initial,
          region: comaker.co_region,
          province: comaker.co_province,
          city: comaker.co_city,
          barangay: comaker.co_barangay,
          street: comaker.co_street,
          zipcode: comaker.co_zipcode,
          position: comaker.position,
          employeeNo: comaker.co_employee_number,
          employeeStatus: comaker.co_employment_status,
          birth: comaker.co_date_of_birth,
          age: comaker.co_age,
          office: comaker.co_office,
          salary: comaker.co_monthly_salary,
          officeTelNo: comaker.co_office_tel_number,
          yearService: comaker.co_years_in_service,
          mobileNo: comaker.co_mobile_number,
        });
      });
  }
}
