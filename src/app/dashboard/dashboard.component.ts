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
    if(event.target.name == 'LED'){
      this.setActuator(event.target.name, event.target.checked ? '1' : '0');
    }else{
      this.setActuator(event.target.name, event.target.value);
    }
    this.getComponents();
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
      let c = JSON.parse(JSON.stringify(data)).updateComponent.component.value;
       console.log('actuatorValue: ', (c));
       this.sensors[4] = c;
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  } 

  sortSensors(sensors:any) {
    return [
      // Ultrasonic sensor
      sensors.filter((sensor) => sensor.name === "Ultrasonic sensor")[0].value.slice(0,5),
      // DHT11 - Temperature
      sensors.filter((sensor) => sensor.name === "DHT11-temperature")[0].value,
      // DHT11 - Humidity
      sensors.filter((sensor) => sensor.name === "DHT11-humidity")[0].value,
      // LDR
      sensors.filter((sensor) => sensor.name === "LDR")[0].value,
      // SG90
      sensors.filter((sensor) => sensor.name === "DC-Motor")[0].value,
      // LED
      sensors.filter((sensor) => sensor.name === "LED")[0].value 
    ]
  }
}
