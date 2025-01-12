import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoanStatus, UserProfile } from '../interface';
import { RequestService } from './request.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private _userProfile = new BehaviorSubject<UserProfile>({
      applicant_id: 0,
      email: '',
      first_name: '' ,
      middle_name: '' ,
      ext_name: '' ,
      last_name: '' ,
      designation: ''
    });

    userProfile$ = this._userProfile.asObservable();

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) {
    this.initUserProfile()
  }


  initUserProfile() {

    this.requestService.get<UserProfile>('user').subscribe({
      next: res => {
        this.setUserProfile(res.message)
      },
      error: error =>
        this.snackbarService.showSnackbar('Error fetching user profile')
    })
  }

  setUserProfile(data: UserProfile) {
    this._userProfile.next(data)
  }
}
