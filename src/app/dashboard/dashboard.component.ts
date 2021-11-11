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

  constructor(private graphqlProductsService: GraphqlProductsService ) { }

  ngOnInit(): void {
    this.getComponents();
  }

  getComponents(){
    this.querySubscription = this.graphqlProductsService.Components("-")
    .valueChanges
    .subscribe(({ data }) => {
      //console.log(JSON.parse(JSON.stringify(data)));
      let c = JSON.parse(JSON.stringify(data));
      c.components.shift();
      this.temp=c.components;
      console.log(this.temp);
      this.sensors=this.sortSensors(this.temp);
    });

  }

  sortSensors(sensors:any){
    let data = {
      ultras: {},
      temp : {},
      humidity : {},
      led : {},
    } 
    sensors.forEach(sensor => {
      if(sensor.unit == "cm") data.ultras = sensor; 
      if(sensor.unit == "°") data.temp = sensor;
      if(sensor.unit == "%") data.humidity = sensor;
      if(sensor.unit == "none") data.led = sensor;
    })
    return data;

  }
}
