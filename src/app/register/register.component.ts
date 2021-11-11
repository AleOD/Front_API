import { Component, OnInit } from '@angular/core';
import { GraphqlUsersService } from '../graphql.users.service';

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
    console.table([this.user, this.email, this.pass, this.isSuperuser]);
    try{
      this.graphqlUsersService.createUser(this.user, this.email, this.pass, this.isSuperuser)
    .subscribe(({ data }) => {
       console.log('registered: ', JSON.stringify(data));
       //this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;
       //localStorage.setItem('token', this.token);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
    }
    catch(e){
      console.log(e);

    }
    
  
  } 



}
