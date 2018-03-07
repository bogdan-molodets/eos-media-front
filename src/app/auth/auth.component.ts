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

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authForm:FormGroup;
  //init form auth fields
  userName = new FormControl('');
  password = new FormControl('');
  constructor() {
    this.initForm();
   }

  ngOnInit() {
  }

  /**
   * Init form auth group
   */
  initForm(){
    this.authForm = new FormGroup({
      userName: this.userName,
      password: this.password
      });
  }

  /**
   * Submit auth form event
   */
  onSubmit(){
    
    
  }
}
