//  Lol for now
export interface Information {
  lastName: string | null;
  firstname: string | null;
  middleName: string | null;
  region: string | null;
  province: string | null;
  city: string | null;
  barangay: string | null;
  street: string | null;
  zipcode: string | null;
  position: string | null;
  employeeNo: string | null;
  employeeStatus: string | null;
  birth: Date | null;
  age: number | null;
  office: string | null;
  salary: number | null;
  officeTelNo: string | null;
  yearService: number | null;
  mobileNo: string | null;
  email: string | null;
}

export interface LoanDetails {
  loanAmount: number | null;
  loanNumber: string | null;
  purpose: string | null;
  term: number | null;
  loanType: string | null;
}

export interface LoanApplication {
  loanDetails: LoanDetails;
  borrowerInfo: Information;
  comakerInfo: Information;
}

export interface LoanStatus {
  application_id: number;
  loan_application_number: number;
  is_approved_osds: string;
  is_approved_accounting: string;
  is_qualified: string;
}

export interface Response<T> {
  success: boolean;
  message: T;
}

export interface CurrentLoanApplication {
  isEditable: boolean;
  ongoingApplication: boolean;
  applicationDetails: LoanApplication | {};
}

export interface Files {
  csc_path: string;
  emergency_path: string;
  idComaker_path: string;
  idApplicant_path: string;
  authorityToDeduct_path: string;
  payslipApplicant_path: string;
  payslipComaker_path: string;
}

export interface FileUpload {
  idLabel: string;
  file: File;
}

export interface LoanHistory {
  loan_application_number: number;
  application_id: number;
  application_date: Date;
  is_qualified: string;
  amount: string;
}

export interface UserProfile {
  applicant_id: number;
  email: string;
  first_name: string;
  middle_name: string;
  ext_name: string | null;
  last_name: string;
  designation: string;
}

export interface OfficeStatus {
  application_id: string;
  status: string;
  updated_at: string | null;
  department_name: string;
  sequence_order: string;
  remarks: string;
  initiator?: string;
}

export interface CurrentLoan {
  application_id: string;
  application_date: string;
  status: string;
}

export interface CurrentHistory {
  application_history_id: string;
  application_id: string;
  remarks: string;
  history_date: string;
  initiator: string;
}

export interface CurrentLoanStatus {
  currentLoan: CurrentLoan | null;
  currentHistory: CurrentHistory | null;
}
