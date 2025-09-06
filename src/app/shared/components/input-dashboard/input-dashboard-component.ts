import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IStatistic } from 'app/interfaces';

@Component({
  selector: 'app-input-dashboard',
  imports: [FormsModule],
  template: `<div class="box-input my-3">
    <input
      class="form-control"
      list="crypto"
      placeholder="Type to search..."
      [(ngModel)]="value"
      (change)="setSymbol()"
    />
    <datalist id="crypto">
      @for (cryptoPairs of statisticsCryptoPairs(); track cryptoPairs.lastId) {
      <option [value]="cryptoPairs.symbol">{{ cryptoPairs.symbol }}</option>
      }
    </datalist>
  </div>`,
  styleUrl: './input-dashboard.component.scss',
})
export class InputDashboard {
  public readonly statisticsCryptoPairs = input<IStatistic[]>([]);
  protected value = signal('');
  protected symbol = output<string>();

  setSymbol() {
    this.symbol.emit(this.value());
  }
}
