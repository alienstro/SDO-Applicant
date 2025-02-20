import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { UserProfile } from '../../interface';
import { TokenService } from '../../service/token.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  firstName: string = '';
  lastName: string = '';
  middleName: string = '';
  extName: string = '';
  designation: string = '';

  constructor(
    private router: Router,
    private tokenService: TokenService

  ) {
  }

  logout(): void {
    this.tokenService.flushToken()
    this.router.navigate(['/login']);
  }

  get parseFullName() {

    return this.firstName + ' ' +
      (this.middleName ? this.middleName : '')
      + ' ' +
      this.lastName
      + ' ' +
      (this.extName ? this.extName : '')
  }


  ngOnInit(): void {
    this.firstName = this.tokenService.firstNameToken(this.tokenService.decodeToken());
    this.middleName = this.tokenService.middleNameToken(this.tokenService.decodeToken());
    this.lastName = this.tokenService.lastNameToken(this.tokenService.decodeToken());
    this.extName = this.tokenService.extNameToken(this.tokenService.decodeToken());
    this.designation = this.tokenService.userDesignationToken(this.tokenService.decodeToken());

    console.log(this.designation)
  }
}