import { Component, OnInit } from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {OAuthService } from 'angular-oauth2-oidc';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  constructor(private oauthService: OAuthService) {
    // Login-Url
    this.oauthService.tokenEndpoint = "https://media-test-service.herokuapp.com/user/auth/token/";

    // Url with user info endpoint
    // This endpont is described by OIDC and provides data about the loggin user
    // This sample uses it, because we don't get an id_token when we use the password flow
    // If you don't want this lib to fetch data about the user (e. g. id, name, email) you can skip this line
    this.oauthService.userinfoEndpoint = "https://steyer-identity-server.azurewebsites.net/identity/connect/userinfo";

    // The SPA's id. Register SPA with this id at the auth-server
    this.oauthService.clientId = "SGzI7E7KWxJ93z2YeiH7QY3Kz406D9Tm3jLAq83Q";

    // set the scope for the permissions the client should request
    this.oauthService.scope = "read write";

    // Set a dummy secret
    // Please note that the auth-server used here demand the client to transmit a client secret, although
    // the standard explicitly cites that the password flow can also be used without it. Using a client secret
    // does not make sense for a SPA that runs in the browser. That's why the property is called dummyClientSecret
    // Using such a dummy secret is as safe as using no secret.
    this.oauthService.dummyClientSecret = "rSQKD8qvd7DDoB6TMKWMdTYqbictZZN2HVa84DHXOIBGEswDnfKN6r3ZR4489BNr0M2VKy4gkmtwDQYVOPLgkuGM6yKKsEb6QtKjpCK6dUakJ7VQ5kfQb253OYwR2tL8";
    this.oauthService.oidc=false;


  }


/*
  constructor(private swUpdate: SwUpdate) {
  }

  ngOnInit(){
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if(confirm("New version available. Load New Version?")) {
            window.location.reload();
        }
      });
    }
  }
  */

}
