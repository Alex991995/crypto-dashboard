import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { IAggTrade } from '@pages/detail-crypto-pars/model';

@Component({
  selector: 'app-agg-table-transaction',
  imports: [DatePipe],
  template: `<div>
    <h4>Recent aggregated transactions</h4>
    <table class="table-sm">
      <thead>
        <tr>
          <th>Time</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Side</th>
        </tr>
      </thead>
      <tbody>
        <tr
          [class.text-success]="!aggData()?.m"
          [class.text-danger]="aggData()?.m"
        >
          <td class="placeholder-glow">
            <span [class]="showPlaceholder(!aggData())"></span>
            {{ aggData()?.T | date : 'HH:mm:ss' }}
          </td>

          <td class="placeholder-glow">
            <span [class]="showPlaceholder(!aggData())"></span>
            {{ aggData()?.p }}
          </td>
          <td class="placeholder-glow">
            <span [class]="showPlaceholder(!aggData())"></span>
            {{ aggData()?.q }}
          </td>
          <td>
            {{ aggData()?.m ? 'Sell' : 'Buy' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
})
export class AggTableTransactionComponent {
  public aggData = input<IAggTrade | undefined>(undefined);

  showPlaceholder(loadingData: boolean) {
    if (loadingData) {
      return 'placeholder col-12 bg-secondary';
    }
    return null;
  }
}
