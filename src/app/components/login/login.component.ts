import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RequestService } from '../../service/request.service';
import { TokenService } from '../../service/auth/token.service';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {


  constructor(
    private requestService: RequestService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  onLogin() {
    this.requestService.login().subscribe({
      next: (res:LoginResponse) => {
        this.tokenService.setTokenInCookie(res.token)
        this.router.navigate(['/application'])
      },
      error: err => {
        console.error(err)
      }
    })
  }
}
