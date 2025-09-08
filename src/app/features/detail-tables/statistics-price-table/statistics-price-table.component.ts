import { Component, input } from '@angular/core';
import { IStatisticsPrice24h } from '@pages/detail-crypto-pars/model';

@Component({
  selector: 'app-statistics-price-table',
  imports: [],
  template: ` <div>
    <h4>24h statistics</h4>
    <table class="table-sm table-striped">
      <thead>
        <tr>
          <th scope="col">High Price</th>
          <th scope="col">Low Price</th>
          <th scope="col">Trading volume</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr>
          <td>{{ statisticsPrice24h()?.h }}</td>
          <td>{{ statisticsPrice24h()?.l }}</td>
          <td>{{ statisticsPrice24h()?.v }}</td>
        </tr>
      </tbody>
    </table>
  </div>`,
})
export class StatisticsPriceTableComponent {
  statisticsPrice24h = input<IStatisticsPrice24h | undefined>(undefined);
}
