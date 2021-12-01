import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { Subscription } from 'rxjs';
//import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
//import { StorageService } from "./storage.service";

const TOKENAUTH = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

const COMPONENTS = gql`
  query Components {
    components {
      name 
      value
      cType
      unit
    }
  }
`;

const COMPONENTSPARAM = gql`
  query Components($name:String!, $cType:String!, $value:String!,$unit:String!) {
    components(name:$name, cType:$cType, value:$value, unit:$unit) {
      id
      name 
      value
      cType
      unit
      owner {
        id
        username
        email
      }
    }
  }
`;





const CREATECOMPONENT = gql`
  mutation CreateComponent($name:String!, $cType:String!, $value:String!,$unit:String!) {
    createComponent(name:$name, cType:$cType, value:$value, unit:$unit) {
      id
      name
      value
      unit
      owner {
        id
      }
   }
  }
  `;

const UPDATECOMPONENT = gql`
  mutation UpdateComponent($name:String!, $value:String!) {
    updateComponent(name:$name, value:$value) {
      component {
        id
        name
        value
    }
  }
  }
  `;


@Injectable({
  providedIn: 'root'
})

export class GraphqlProductsService  {

  loading: boolean;
  posts: any;
  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  Components(valor : string) {
    //alert(valor);
    if (valor=="-")
    {
      return this.apollo.watchQuery({
        query: COMPONENTS 
      });
    }
    else
    {
      //alert(valor);
      return this.apollo.watchQuery({
        query: COMPONENTSPARAM,
        variables: {
          nombre: valor
        }, 
      });
    }
}
 
 createComponent(mytoken: string, name: string, value: string, cType: string, unit: string) {
       console.log("token auth = " + mytoken);
      return this.apollo.mutate({
        mutation: CREATECOMPONENT,
        variables: {
          name: name,
          value: value,
          cType: cType,
          unit: unit
        },
        context: {
          // example of setting the headers with context per operation
          headers: new HttpHeaders().set('Authorization', 'JWT ' + mytoken),
        },

      }); 
  }
 
 updateComponent(mytoken: string, name: string, value: string) {
       console.log("token auth = " + mytoken);
      return this.apollo.mutate({
        mutation: UPDATECOMPONENT,
        variables: {
          name: name,
          value: value
        },
        context: {
          // example of setting the headers with context per operation
          headers: new HttpHeaders().set('Authorization', 'JWT ' + mytoken),
        },

      }); 
  }  


   
}