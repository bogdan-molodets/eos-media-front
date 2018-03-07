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
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})
export class RegComponent implements OnInit {
  public regForm:FormGroup;
  //Init form reg fields
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  userName = new FormControl('', [Validators.required, Validators.maxLength(150)]);
  email = new FormControl('', [Validators.required,Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]);
  firstField = new FormControl('', [Validators.required, Validators.minLength(8)]);
  secondField = new FormControl('', [Validators.required, Validators.minLength(8)]);
  constructor() {
    this.initForm();
  }

  ngOnInit() {
  }
  /**
   * Init form reg group
   */
  initForm(){
    this.regForm = new FormGroup({
      name: new FormGroup({
        firstName: this.firstName,
        lastName: this.lastName
      }),
      userName: this.userName,
      email: this.email,
      password: new FormGroup({
        firstField: this.firstField,
        secondField: this.secondField
      })
  })
  }

  /**
   * Submit reg form event
   */
  onSubmit() {
    if(this.regForm.valid){
    }else{
      console.log('error');
    }
    
  }

}
