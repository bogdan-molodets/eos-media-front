import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  token: any;
  csrf: any;
  address: any;

  constructor(private authService: AuthService, private router: Router) {
    this.address = window.location.origin;

  }

  ngOnInit() {
    this.authService.getToken().subscribe(res => {
      this.token = res['token'];      
      console.log(this.token);
    });
    ///this.token = this.oauthService.getAccessToken();
    //console.log(this.token);
  }

  logOut() {
    // $.ajax({
    //   url: "https://auth.eos.com/api/v1/user/logout/",
    //   type : "POST",
    //   headers: { 'x-csrftoken': 'getDom().getCookie()' },
    //   xhrFields: { withCredentials: true},
    //   success : function(r) {
    //     console.log('User logout');
    //   }
    // });
    this.authService.logout(this.csrf).subscribe(res => {
      console.log('res');
    });
    // this.oauthService.logOut();
    //this.token = this.oauthService.getAccessToken();
  }

  logIn() {

    // this.oauthService.initImplicitFlow();
    //  this.router.navigateByUrl('/auth');
    // this.token = this.oauthService.getAccessToken();
  }

  signUp() {



    // let token='';
    // $.ajax({
    //   url: "https://auth.eos.com/api/v1/user/token/",
    //   type : "GET",
    //   xhrFields: { withCredentials: true},
    //   success : function(r) {
    //     $.ajax({
    //       url: 'https://auth.eos.com/api/v1/user/details/',
    //       dataType: "json",
    //       type : "GET",
    //       headers: { 'Authorization': `Token ${r['token']}`},
    //       success : function(r) {
    //         console.log(r.data);
    //       },
    //       error: function(e){
    //         console.log(e)
    //       }
    //     });
    //   },
    //   error: function(e){
    //     console.log('Not authenticated');
    //   }
    // });

    // $.ajax({
    //   url: "https://auth.eos.com/api/v1/user/logout/",
    //   type : "POST",

    //   xhrFields: { withCredentials: true},
    //   success : function(r) {
    //     console.log('User logout');
    //   }
    // });
    // this.authService.logout().subscribe(res=>{
    //   this.authService.getToken().subscribe(res=>{

    //   });
    // });
    // this.router.navigateByUrl('/reg');
    // this.token = this.oauthService.getAccessToken();
  }

}
