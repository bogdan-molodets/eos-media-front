export class Register {
    first_name: string;
    last_name: string;
    repeat_password: string;
    password: string;
    email: string;
    username: string;
    /**
     *
     */
    constructor(fName:string,lName:string,pass:string,repeatpass:string,mail:string,uName:string) {    
        this.first_name=fName;
        this.last_name=lName;
        this.repeat_password=repeatpass;
        this.password=pass;
        this.email=mail;
        this.username=uName;
    }
}