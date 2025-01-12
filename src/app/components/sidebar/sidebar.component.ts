import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { UserProfile } from '../../interface';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  userProfile!: UserProfile

  constructor(private userService: UserService) {
    this.userService.userProfile$.subscribe(
      res => {
        this.userProfile = res
      }
    )
  }

  get parseUsername() {

    return this.userProfile.first_name + ' ' +
    (this.userProfile.middle_name ? this.userProfile.middle_name : '')
    + ' ' +
    this.userProfile.last_name
    + ' ' +
    (this.userProfile.ext_name ? this.userProfile.ext_name : '')
  }


}
