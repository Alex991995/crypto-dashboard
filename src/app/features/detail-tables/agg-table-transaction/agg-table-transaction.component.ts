import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { IAggTrade } from '@pages/detail-crypto-pars/model';

@Component({
  selector: 'app-agg-table-transaction',
  imports: [DatePipe],
  templateUrl: './agg-table-transaction.component.html',
})
export class AggTableTransactionComponent {
  public aggData = input<IAggTrade | undefined>(undefined);

  skeleton(loadingData: boolean) {
    if (loadingData) {
      return 'placeholder col-12 bg-secondary';
    }
    return null;
  }
}
