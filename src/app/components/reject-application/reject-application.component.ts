import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TokenService } from '../../service/token.service';
import { RequestService } from '../../service/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoanApplicationService } from '../../service/loan-application.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reject-application',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reject-application.component.html',
  styleUrl: './reject-application.component.scss',
})
export class RejectApplicationComponent {
  application_id!: number;
  user_id!: number;
  department_id!: string;
  remarks_message!: string;

  constructor(
    public dialogRef: MatDialogRef<RejectApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private requestService: RequestService,
    private snackbar: MatSnackBar,
    private router: Router,
    private applicationService: LoanApplicationService
  ) {
    this.application_id = this.data.application_id;
    this.user_id = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );

    console.log('department id: ', this.department_id);
  }

  rejectApplicationOffice() {
    const remarks = this.remarks_message;

    const data = {
      application_id: this.application_id,
      remarks: remarks,
    };

    // console.log(data);

    // return;

    console.log('Co-Maker Rejection');
    this.requestService.rejectApprovalApplication(data).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.snackbar.open('Rejected Application Successfully!', '', {
            duration: 3000,
          });
          this.dialogRef.close('refresh');
        } else {
          this.snackbar.open('Failed to reject. Please try again.', '', {
            duration: 3000,
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open(
          'An error occurred while rejected the application.',
          '',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
