import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
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
import SignaturePad from 'signature_pad';

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
export class ApplicationFormComponent implements OnInit {
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
  email: string = '';
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
    private cdr: ChangeDetectorRef
  ) {
    this.applicantId = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );

    this.email = this.tokenService.userEmailToken(
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
    // Populate loan details
    this.loanDetailsForm.patchValue({
      loanAmount: 50000,
      loanNumber: '202210599',
      purpose: 'Hospitalization/Medical',
      otherPurpose: '',
      term: 12,
      loanType: 'Multi-Purpose (renewal)',
    });

    // Populate borrower information
    this.borrowerInfoForm.patchValue({
      lastName: 'Dela Cruz',
      firstname: 'Juan',
      middleName: 'Santos',
      region: 'REGION I (ILOCOS)',
      province: 'ILOCOS NORTE',
      city: 'BOTOLAN',
      barangay: 'Bangan',
      street: '123 Main Street',
      zipcode: '4030',
      position: 'Teacher I',
      employeeNo: '1111',
      employeeStatus: 'Permanent',
      birth: new Date('1985-01-15'),
      age: 40,
      office: 'Los Baños Elementary School',
      salary: 35000,
      officeTelNo: '23423432',
      yearService: 10,
      mobileNo: '09171234567',
    });

    // Populate comaker information
    this.comakerInfoForm.patchValue({
      email: 'robinaquino2@gmail.com',
      // lastName: 'Garcia',
      // firstname: 'Maria',
      // middleName: 'Cruz',
      // region: 'REGION I (ILOCOS)',
      // province: 'ILOCOS NORTE',
      // city: 'BOTOLAN',
      // barangay: 'Bangan',
      // street: '456 Secondary Street',
      // zipcode: '4030',
      // position: 'Teacher II',
      // employeeNo: '11111',
      // employeeStatus: 'Co-Terminus',
      // birth: new Date('1980-05-20'),
      // age: 45,
      // office: 'Los Baños High School',
      // salary: 40000,
      // officeTelNo: '234234324',
      // yearService: 15,
      // mobileNo: '09181234567',
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
    email: new FormControl('', [Validators.required]),
    // lastName: new FormControl('', [Validators.required]),
    // firstname: new FormControl('', [Validators.required]),
    // middleName: new FormControl(''),
    // region: new FormControl('', [Validators.required]),
    // province: new FormControl('', [Validators.required]),
    // city: new FormControl('', [Validators.required]),
    // barangay: new FormControl('', [Validators.required]),
    // street: new FormControl('', [Validators.required]),
    // zipcode: new FormControl('', [Validators.required]),
    // position: new FormControl('', [Validators.required]),
    // employeeNo: new FormControl('', [Validators.required]),
    // employeeStatus: new FormControl('', [Validators.required]),
    // birth: new FormControl(new Date(), [Validators.required]),
    // age: new FormControl(0),
    // office: new FormControl('', [Validators.required]),
    // salary: new FormControl(0, [Validators.required]),
    // officeTelNo: new FormControl('', [Validators.required]),
    // yearService: new FormControl(0, [Validators.required]),
    // mobileNo: new FormControl('', [Validators.required]),
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

    this.comakerInfoForm.patchValue({
      email: currentLoan.comakerInfo.email,
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
    const sigData = this.getSignatureDataURL();
    applicantionFormdata.append('signature', sigData);

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

          this.loanApplicationService.initCurrentLoan();

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
    this.comakerInfoForm.patchValue({ email: '' });

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

  coMakerEmailValidator(applicantEmail: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value === applicantEmail) {
        return { sameAsApplicant: true };
      }
      return null;
    };
  }

  ngOnInit() {
    this.comakerInfoForm
      .get('email')
      ?.addValidators(this.coMakerEmailValidator(this.email));
  }
}
