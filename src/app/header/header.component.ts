import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  token: any;

  constructor(private oauthService: OAuthService, private router: Router) { }

  ngOnInit() {
    this.token = this.oauthService.getAccessToken();
    console.log(this.token);
  }

  logOut() {
    this.oauthService.logOut();
    this.token = this.oauthService.getAccessToken();
  }

  logIn() {
    this.router.navigateByUrl('/auth');
    this.token = this.oauthService.getAccessToken();
  }

  signUp() {
    this.router.navigateByUrl('/reg');
    this.token = this.oauthService.getAccessToken();
  }

}
