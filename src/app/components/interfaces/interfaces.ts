export interface LoanApplication {
    application_id: number;
    applicant_id: number;
    application_date: Date;
    amount: number;
    loan_type: string;
    is_approved_osds: string;
    is_approved_accounting: string;
    is_qualified: string;
}

export interface LoanDetails {
    loan_details_id: number;          
    loan_amount: number;             
    type_of_loan: string;           
    term: string;                    
    loan_application_number: number;
    purpose: string;                  
    borrowers_agreement: string;
    co_makers_agreement: string;  
    applicant_id: number;           
    application_id: number;       
}

export interface CoMakersInformation {
    co_makers_id: number;         
    last_name: string;               
    first_name: string;           
    middle_initial: string;         
    region: string;           
    province: string;                
    city: string;                       
    barangay: string;              
    street: string;                  
    zipcode: number;                    
    employee_number: number;         
    employment_status: string;     
    date_of_birth: string;              
    age: string;                      
    office: string;            
    monthly_salary: number;        
    office_tel_number: string;       
    years_in_service: number;         
    mobile_number: string;           
    applicant_id: number;      
    application_id: number;            
}

export interface BorrowersInformation {
    borrowers_id: number;             
    last_name: string;               
    first_name: string;           
    middle_initial: string;      
    region: string;                 
    province: string;                 
    city: string;                    
    barangay: string;                
    street: string;                   
    zipcode: number;                 
    employee_number: number;           
    employment_status: string;        
    date_of_birth: string;            
    age: string;                       
    office: string;                   
    monthly_salary: number;             
    office_tel_number: string;          
    years_in_service: number;        
    mobile_number: string;            
    applicant_id: number;             
    application_id: number;             
}



