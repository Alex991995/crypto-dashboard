import { Component, Input, input } from '@angular/core';
import { IBidAskSpread } from '@pages/detail-crypto-pars/model';

@Component({
  selector: 'app-order-book',
  imports: [],
  styleUrl: './order-book.component.scss',
  template: `<table class="table-sm table-striped">
    <thead>
      <tr>
        <th scope="col">{{ firstHeaderTable() }}</th>
        <th scope="col">{{ secondHeaderTable() }}</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      @for (data of arrayData(); track $index) {
      <tr
        [class]="data?.['class-animation']"
        (animationend)="removeClassAfterAnimation(data)"
      >
        <td>
          {{ data.newValue }}
        </td>
        <td>{{ data.volume }}</td>
      </tr>
      }
    </tbody>
  </table>`,
})
export class OrderBookComponent {
  firstHeaderTable = input.required<string>();
  secondHeaderTable = input.required<string>();
  arrayData = input<IBidAskSpread[]>([]);

  removeClassAfterAnimation(data: IBidAskSpread) {
    data['class-animation'] = null;
  }
}
