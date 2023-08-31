import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const SENZORSAPI = 'http://localhost:5230/sensors/';

export interface Senzor {
  id: string;
  label: string;
}

export interface SenzorExtended extends Senzor {
  selected: boolean;
}

export interface SenzorData {
  hitsPerPeriod: number[];
  sensorId: string;
}

export interface SenzorDataRequestModel {
  from: string;
  to: string;
  period: number;
  sensorsToReturn: string[];
  perfectlyPredictedData: boolean;
}

export interface SenzorDataRemapped {
  date: number;
  value: number;
}

export interface SenzorDataFinal {
  name: string;
  data: SenzorDataRemapped;
}

export enum Periods {
  Minute = 0,
  Hour = 1,
  Day = 2,
  Month = 3,
  Quarter = 4,
}

@Injectable({
  providedIn: 'root',
})
export class SenzorApiService {
  constructor(private http: HttpClient) {}

  getSenzors() {
    return this.http.get<Senzor[]>(SENZORSAPI + 'get-sensors');
  }

  getData(model: SenzorDataRequestModel) {
    return this.http.post<SenzorData[]>(SENZORSAPI + 'get-sensor-data', model);
  }
}
