import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RequestService } from '../../service/request.service';
import { TokenService } from '../../service/token.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface LoginResponse {
  token: string
}

interface LoginRequest {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  errMessage = ''

  constructor(
    private requestService: RequestService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  userLogin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })

  onLogin() {
    this.errMessage = ''
    const inputCred = this.userLogin.getRawValue();

    if (!inputCred.email || !inputCred.password) return;

    const loginCred: LoginRequest = {
      email: inputCred.email as string,
      password: inputCred.password as string
    };

    
    this.requestService.login(loginCred).subscribe({
      next: (res: LoginResponse) => {
        this.tokenService.setToken(res.token);
        this.router.navigate(['/application']);
      },
      error: err => {
        if (err.status === 401) {
          this.errMessage = 'Invalid Credentials'
        } else {
          this.errMessage = 'Error Logging in'
        }
      }
    });
  }
}
