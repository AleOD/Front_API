import { Component, OnInit } from '@angular/core';
import { GraphqlUsersService } from '../graphql.users.service';
//import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: string = "";
  pass: string = "";
  email: string = "test@test.com";
  token: string = "";
  isSuperuser: boolean = false;

  constructor(private graphqlUsersService: GraphqlUsersService) { }

  ngOnInit(): void {
  }

registerUser() {
    //console.table([this.user, this.email, this.pass, this.isSuperuser]);

      this.graphqlUsersService.createUser(this.user, this.email, this.pass, this.isSuperuser)
    .subscribe(({ data }) => {
       console.log('registered: ', JSON.stringify(data));
       //this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;
       //localStorage.setItem('token', this.token);
       this.loginUser();

    }, (error) => {
       console.log('there was an error sending the query', error);
    });
} 

loginUser() {
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
       this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;
       localStorage.setItem('token', this.token);
       if(this.token)window.open('http://34.125.7.41:8082/dashboard','_self');
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  
  } 


}
