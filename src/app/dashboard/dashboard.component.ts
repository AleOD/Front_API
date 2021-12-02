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
  logData = []; //logs 
  sensors = {};
  slider: string = "";
  token: string = localStorage.getItem('token');


  blurEvent(event: any){    
    if(event.target.name == 'LED'){
      console.log('LED',event.target.name, event.target.checked);
      this.setActuator(event.target.name, event.target.checked ? '1' : '0');
    }else{
      console.log('MOTOR',event.target.name, event.target.value);
      this.setActuator(event.target.name, event.target.value);
    }
    //this.getComponents();
  }

  checkToken() {
    if (!localStorage.getItem('token')) {
      window.open('http://34.125.235.58:8082/','_self');
    }
  }

  refresh(){
    window.open('http://34.125.235.58:8082/dashboard','_self');
  }

  constructor(private graphqlProductsService: GraphqlProductsService ) { }

  ngOnInit(): void {
    this.checkToken();
    this.getComponents();
    this.getLogs();
  }
  
  logout(){
    localStorage.clear();
    window.open('http://34.125.235.58:8082/','_self');
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
       if(name === 'DC-Motor' ) this.sensors[4] = c;
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
      // DC-Motor
      sensors.filter((sensor) => sensor.name === "DC-Motor")[0].value,
      // LED
      sensors.filter((sensor) => sensor.name === "LED")[0].value 
    ]
  }

  getLogs(){
    this.querySubscription = this.graphqlProductsService.Logs()
    .valueChanges
    .subscribe(({ data }) => {
    let l = JSON.parse(JSON.stringify(data));
    //console.log('LOGS FROM API: ', l.logs);
    this.logData = this.sortLogs(l.logs);
    console.log('LOGS FROM API: ', this.logData);
    localStorage.setItem('temperature', JSON.stringify(this.logData[0]));
    localStorage.setItem('humidity', JSON.stringify(this.logData[1]));
    })
  }
  sortLogs(logs:any) {
  return [
    // DHT11 - Temperature
    this.sortIndividualLogs(logs.filter((sensor) => sensor.name === "DHT11-temperature")),
    // DHT11 - Humidity
    this.sortIndividualLogs(logs.filter((sensor) => sensor.name === "DHT11-humidity"))
    // DC-Motor
    //logs.filter((sensor) => sensor.name === "DC-Motor"),
    // LED
    //logs.filter((sensor) => sensor.name === "LED") 

    ]
  }

  sortIndividualLogs(logs:any) {
    let time1, time2, tmp1, tmp2, stop1, stop2, date_ref1, date_ref2;
    return logs.sort((a, b) => {
        stop1 = a.created.split('T');
        stop2 = b.created.split('T');
        
        tmp1 = stop1[0].split('-');
        tmp2 = stop2[0].split('-');
        
        time1 = stop1[1].split('.')[0].split(':');
        time2 = stop2[1].split('.')[0].split(':');

        date_ref1 = parseInt(`${time1[0]}${time1[1]}${time1[2]}`);
        date_ref2 = parseInt(`${time2[0]}${time2[1]}${time2[2]}`);
        
        return date_ref1 - date_ref2;
    });
}
}
