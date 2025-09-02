import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IStatistic } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseURL = 'https://fapi.binance.com';

  getStatistics() {
    return this.http.get<IStatistic[]>(this.baseURL + '/fapi/v1/ticker/24hr');
  }
}
