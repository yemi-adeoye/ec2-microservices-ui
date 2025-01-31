import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private http: HttpClient) {

  }

  ngAfterViewInit(): void {

    // this.createChart()
    // .then(data => console.log(data))
    // .catch(err => console.error(err, "Something went wrong"))
  }

  @ViewChild("chartRef")
  chartRef!: any

  createChart = () => {
    let chartContext = this.chartRef.nativeElement.getContext('2d')

    new Chart(chartContext, {
      type: 'line',
      data: {
        labels: ["Boys", "girls"],
        datasets: [
          {
            label: "Aquisitions per year",
            data: [120, 470]
          }
        ]
      }
    })
  }




}
