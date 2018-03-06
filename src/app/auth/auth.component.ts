import { Component, OnInit } from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private oauthService: OAuthService) { }

  ngOnInit() {
  }

  login() {
    this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile('username', 'password').then(() => {
      let claims = this.oauthService.getIdentityClaims();
      if (claims) console.debug('given_name', claims);
    });
  }

  logout(){
    this.oauthService.logOut();
  }

}
