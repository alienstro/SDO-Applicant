import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TokenService } from '../../service/token.service';
import { RequestService } from '../../service/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-comaker-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-comaker-dialog.component.html',
  styleUrl: './change-comaker-dialog.component.scss',
})
export class ChangeComakerDialogComponent {
  application_id!: number;
  department_id!: string;
  email!: string;
  applicantEmail: string = '';

  constructor(
    public dialogRef: MatDialogRef<ChangeComakerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenService: TokenService,
    private requestService: RequestService,
    private snackbar: MatSnackBar
  ) {
    this.application_id = this.data.application_id;

    this.applicantEmail =
      this.tokenService.userEmailToken(this.tokenService.decodeToken()) || '';
    // console.log('department id: ', this.department_id);
  }


  isSameAsApplicant(): boolean {
    if (!this.email || !this.applicantEmail) return false;
    return (
      this.email.trim().toLowerCase() ===
      this.applicantEmail.trim().toLowerCase()
    );
  }

  changeCoMaker() {
    const email = this.email;

    if (this.isSameAsApplicant()) {
      this.snackbar.open(
        "Comaker email cannot be the same as borrower's email.",
        '',
        {
          duration: 3000,
        }
      );
      return;
    }

    const data = {
      application_id: this.application_id,
      email: email,
    };

    // console.log(data);

    // return;

    // console.log('Change of Co-Maker');
    this.requestService.changeCoMakerEmail(data).subscribe({
      next: (res) => {
        // console.log(res);
        if (res.success) {
          this.snackbar.open('Change Co-Maker Successfully!', '', {
            duration: 3000,
          });
          this.dialogRef.close('refresh');
        } else {
          this.snackbar.open('Failed to change. Please try again.', '', {
            duration: 3000,
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open(
          'An error occurred while changing the email of the application.',
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
