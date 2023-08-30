import { Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
} from 'ng-apexcharts';
import { dataSeries } from './data-series';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public series!: ApexAxisChartSeries;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  constructor() {
    this.initChartData();
  }

  public initChartData(): void {
    const data = dataSeries[0].map((dataPoint) => {
      return [new Date(dataPoint.date).getTime(), dataPoint.value];
    });

    // Min i max timestampa
    const minTimestamp = Math.min(...data.map((item) => item[0]));
    const maxTimestamp = Math.max(...data.map((item) => item[0]));

    this.series = [
      {
        name: 'Broj ljudi u prostoriji',
        data: data,
      },
    ];
    this.chart = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    };
    this.dataLabels = {
      enabled: false,
    };
    this.markers = {
      size: 0,
    };
    this.title = {
      text: 'Broj ljudi u prostoriji',
      align: 'left',
    };
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    };
    this.yaxis = {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      title: {
        text: 'Broj ljudi',
      },
    };
    this.xaxis = {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        formatter: function (val) {
          const date = new Date(val);

          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
          };

          const croatianLocale = 'hr-HR';

          return date.toLocaleDateString(croatianLocale, options);
        },
      },
      min: minTimestamp,
      max: maxTimestamp,
      tickAmount: 10,
      tickPlacement: 'on',
    };

    this.tooltip = {
      shared: false,
      x: {
        formatter: function (val) {
          return new Date(val).toLocaleDateString('hr-HR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
          });
        },
      },
      y: {
        formatter: function (val) {
          return val.toString();
        },
      },
    };
  }
}
