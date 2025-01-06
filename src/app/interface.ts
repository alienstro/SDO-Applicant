//  Lol for now
export interface Information {
  lastName: string | null
  firstname: string | null
  middleName: string | null
  region: string | null
  province: string | null
  city: string | null
  barangay: string | null
  street: string | null
  zipcode: string | null
  employeeNo: string | null
  employeeStatus: string | null
  birth: Date | null
  age: number | null
  office: string | null
  salary: number | null
  officeTelNo: string | null
  yearService: number | null
  mobileNo: string | null
}

export interface LoanDetails {
  loanAmount: number | null
  loanNumber: string | null
  purpose:   string | null
  term: string | null
  loanType:   string | null
}


export interface LoanApplication {
  loanDetails: LoanDetails
  borrowerInfo: Information
  comakerInfo: Information
}
