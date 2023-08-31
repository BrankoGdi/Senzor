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
import {
  Periods,
  Senzor,
  SenzorApiService,
  SenzorData,
  SenzorDataFinal,
  SenzorDataRemapped,
  SenzorExtended,
} from 'src/senzor-api.service';

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
  public senzors!: SenzorExtended[];
  public senzorData!: SenzorData[];
  public fromDate!: string;
  public toDate!: string;
  public periods = Object.entries(Periods)
    .map(([key, value]) => ({ key, value }))
    .slice(5);
  public selectedPeriod!: number;

  constructor(private senzorApi: SenzorApiService) {
    // this.initChartData();
    this.senzorApi.getSenzors().subscribe((resp) => {
      this.senzors = resp.map((x) => {
        return {
          ...x,
          selected: true,
        } as SenzorExtended;
      });
      this.getNewData();
      this.getPredictedData();
    });
  }

  public getNewData(): void {
    this.senzorApi
      .getData({
        from: this.fromDate,
        to: this.toDate,
        period: this.selectedPeriod,
        sensorsToReturn: this.senzors
          .filter((x) => x.selected)
          .map((x) => x.id),
        perfectlyPredictedData: false,
      })
      .subscribe((resp) => {
        // this.senzorData = resp;
        this.initChartData(
          this.transformData(
            resp,
            this.fromDate,
            this.toDate,
            this.selectedPeriod
          ),
          this.fromDate,
          this.toDate
        );
      });
  }

  //PREDVIDANJE
  public getPredictedData(): void {
    this.senzorApi
      .getData({
        from: this.fromDate,
        to: this.toDate,
        period: this.selectedPeriod,
        sensorsToReturn: this.senzors
          .filter((x) => x.selected)
          .map((x) => x.id),
        perfectlyPredictedData: true,
      })
      .subscribe((resp) => {
        // this.senzorData = resp;
        this.initChartData(
          this.transformData(
            resp,
            this.fromDate,
            this.toDate,
            this.selectedPeriod
          ),
          this.fromDate,
          this.toDate
        );
      });
  }

  public transformData(
    data: SenzorData[],
    from: string,
    to: string,
    period: number
  ): [] {
    let dataBySenzor;
    var mutlipyBy = 0;
    if (period == Periods.Minute) mutlipyBy = 60 * 1000;
    if (period == Periods.Day) mutlipyBy = 24 * 60 * 60 * 1000;
    if (period == Periods.Hour) mutlipyBy = 60 * 60 * 1000;
    if (period == Periods.Month) mutlipyBy = 30 * 24 * 60 * 60 * 1000;
    if (period == Periods.Quarter) mutlipyBy = 4 * 30 * 24 * 60 * 60 * 1000;
    const senzorData = [] as SenzorDataRemapped[];
    data.forEach((x) => {
      for (var i = 0; i < x.hitsPerPeriod.length; i++) {
        senzorData.push({
          date: new Date(from).getTime() + i * mutlipyBy,
          value: x.hitsPerPeriod[i],
        } as SenzorDataRemapped);
      }
      dataBySenzor = { name: x.sensorId, data: senzorData };
      // x.hitsPerPeriod.forEach(y => {
      //     senzorData.push({date: new Date(from).getTime() + counter * mutlipyBy, value: y} as SenzorDataRemapped)

      // })
    });
    return [];
  }

  public initChartData(
    chartData: SenzorDataFinal[],
    from: string,
    to: string
  ): void {
    // const data = chartData[0].map((dataPoint) => {
    //   return [new Date(dataPoint.date).getTime(), dataPoint.value];
    // });

    // Min i max timestampa
    // const minTimestamp = Math.min(...data.map((item) => item[0]));
    // const maxTimestamp = Math.max(...data.map((item) => item[0]));

    const minTimestamp = new Date(from).getTime();
    const maxTimestamp = new Date(to).getTime();

    this.series = [];

    chartData.forEach((x) => {
      const formattedData = {
        x: new Date(x.data.date).getTime(),
        y: x.data.value,
      };
      this.series.push({ name: x.name, data: [formattedData] });
    });

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
