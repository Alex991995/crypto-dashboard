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
        <tr class="placeholder-glow">
          <td>
            {{ statisticsPrice24h()?.h }}
            <span [class]="showPlaceholder(!statisticsPrice24h())"></span>
          </td>
          <td>
            {{ statisticsPrice24h()?.l }}
            <span [class]="showPlaceholder(!statisticsPrice24h())"></span>
          </td>
          <td>
            {{ statisticsPrice24h()?.v }}
            <span [class]="showPlaceholder(!statisticsPrice24h())"></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
})
export class StatisticsPriceTableComponent {
  statisticsPrice24h = input<IStatisticsPrice24h | undefined>(undefined);

  showPlaceholder(loadingData: boolean) {
    if (loadingData) {
      return 'placeholder col-12 bg-secondary';
    }
    return null;
  }
}
