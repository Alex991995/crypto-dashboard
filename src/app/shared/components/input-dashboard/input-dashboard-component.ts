import { Component, input } from '@angular/core';
import { IStatistic } from 'app/interfaces';

@Component({
  selector: 'app-input-dashboard',
  template: `<div class="box-input my-3">
    <input class="form-control" list="crypto" placeholder="Type to search..." />
    <datalist id="crypto">
      @for (cryptoPairs of statisticsCryptoPairs(); track cryptoPairs.lastId) {
      <option [value]="cryptoPairs.symbol">{{ cryptoPairs.symbol }}</option>
      }
    </datalist>
  </div>`,
  styleUrl: './input-dashboard.component.scss',
})
export class InputDashboard {
  statisticsCryptoPairs = input<IStatistic[]>([]);
}
