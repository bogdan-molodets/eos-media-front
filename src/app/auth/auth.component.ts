
import { OAuthService } from 'angular-oauth2-oidc';
import {
  NgModule,
  Component,
  Pipe,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {


  authForm: FormGroup;
  // init form auth fields
  userName = new FormControl('');
  password = new FormControl('');
  constructor(private oauthService: OAuthService, private router: Router) {
    this.initForm();
  }

  ngOnInit() {
  }


  /**
   * Init form auth group
   */
  initForm() {
    this.authForm = new FormGroup({
      userName: this.userName,
      password: this.password
    });
  }

  /**
   * Submit auth form event
   */
  onSubmit() {
   
    // this.oauthService.fetchTokenUsingPasswordFlow(this.authForm.value.userName, this.authForm.value.password).then(() => {
    //   this.router.navigateByUrl('');
    //  // let claims = this.oauthService.getIdentityClaims();
    //  // if (claims) console.debug('given_name', claims);
    // }).catch(err => {
    //   console.log(err);
    // });

  }
}
