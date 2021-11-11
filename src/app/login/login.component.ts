import { Component, OnInit } from '@angular/core';
import { GraphqlUsersService } from '../graphql.users.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: string = "";
  pass: string = "";
  token: string = "";
  constructor(private graphqlUsersService: GraphqlUsersService) { }

  ngOnInit(): void {
  }



loginUser() {
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
       this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;
       localStorage.setItem('token', this.token);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  
  }  
}