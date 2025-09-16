import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IHistoryCandle } from '@pages/detail-crypto-pars/model';
import { IStatistic } from 'app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseURL = 'https://fapi.binance.com';

  getStatistics() {
    return this.http.get<IStatistic[]>(this.baseURL + '/fapi/v1/ticker/24hr');
  }
  getHistoryCandles(symbol: string, interval: string) {
    return this.http.get<IHistoryCandle[]>(
      this.baseURL + `/fapi/v1/klines?symbol=${symbol}&interval=${interval}`
    );
  }
}
