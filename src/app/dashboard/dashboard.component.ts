import { Component, OnInit } from '@angular/core';
import { GraphqlProductsService } from '../graphql.products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private querySubscription: Subscription;

  temp = [];
  sensors = {};
  slider: string = "";
  token: string = localStorage.getItem('token');

  blurEvent(event: any){
    this.setActuator(event.target.name, event.target.value);
  }

  constructor(private graphqlProductsService: GraphqlProductsService ) { }

  ngOnInit(): void {
    this.getComponents();
  }

  getComponents(){
    this.querySubscription = this.graphqlProductsService.Components("-")
    .valueChanges
    .subscribe(({ data }) => {
      let c = JSON.parse(JSON.stringify(data));
      c.components.shift();
      console.log('DATA FROM API: ', c.components);
      this.temp=c.components;
      this.sensors=this.sortSensors(this.temp);
    })
  }

  setActuator(name:string, value:string) {  
    this.graphqlProductsService.updateComponent(this.token,name,value)
    .subscribe(({ data }) => {
       console.log('actuatorValue: ', JSON.stringify(data));
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  } 

  sortSensors(sensors:any) {
    return [
      // Ultrasonic sensor
      sensors.filter((sensor) => sensor.unit === "cm")[0].value.slice(0,5),
      // DHT11 - Temperature
      sensors.filter((sensor) => sensor.unit === "°")[0].value,
      // DHT11 - Humidity
      sensors.filter((sensor) => sensor.unit === "%")[0].value,
      // LDR
      sensors.filter((sensor) => sensor.unit === "none")[0].value
    ]
  }
}
