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

  sensors_test = [
      {
        name: "DHT11",
        value: "58",
        unit: "degrees"
      },
      {
        name: "Ultrasonic sensor",
        value: "2.5814977185479524",
        unit: "cm"
      },
      {
        name: "LDR",
        value: "1",
        unit: "none"
      },
      // Probar con el servo funcionando...
      // {
      //   name: "SG90",
      //   value: "1",
      //   unit: "none"
      // },
      {
        name: "DHT11-temperature",
        value: "24",
        unit: "°"
      },
      {
        name: "DHT11-humidity",
        value: "37",
        unit: "%"
      }
  ];

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
      this.temp=c.components; // estos son los datos que vienen de la API
      if (this.temp.length === 0) {
        this.temp = this.sensors_test; // Si no hay nada, usa datos de prueba jeje.
        console.log(this.temp);
      }
      this.sensors=this.sortSensors(this.temp);
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
