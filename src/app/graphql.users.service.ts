import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';

const TOKENAUTH = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

const CREATEUSER = gql`
  mutation CreateUser($username: String!, $password: String!, $email: String!, $isSuperUser:Boolean!) {
    createUser(username: $username, password: $password, email: $email, isSuperUser: $isSuperUser) {
      user{ 
        id
        username
        email
        isSuperuser
      }
    }
  }
  `;

@Injectable({
  providedIn: 'root'
})

export class GraphqlUsersService {
  constructor(private apollo: Apollo) {}

  tokenAuth(username: string, password: string) {
 
    return this.apollo.mutate({
      mutation: TOKENAUTH,
      variables: {
        username: username,
        password: password
      }
    });
  
    }

  createUser(username: string, email: string, password: string, isSuperuser: boolean) {
      return this.apollo.mutate({
        mutation: CREATEUSER,
        variables: {
          username: username,
          email: email,
          password: password,
          isSuperUser: Boolean(isSuperuser)
        }
      });
  }
   
}