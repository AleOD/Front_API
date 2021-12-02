import { Component, OnInit } from '@angular/core';
import { GraphqlUsersService } from '../graphql.users.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: string = "";
  pass: string = "";
  token: string = "";
  constructor(private graphqlUsersService: GraphqlUsersService, public router: Router) { }

  ngOnInit(): void {
  }

loginUser() {
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
       this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;
       localStorage.setItem('token', this.token);
      //  if(this.token)window.open('http://34.125.7.41:8083/dashboard','_self');
      this.router.navigate(['/dashboard']);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  
  }  
}


