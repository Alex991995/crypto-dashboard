import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ErrorServiceService } from '@core/services/error-service.service';
import { IStatistic } from 'app/interfaces';
import { fromEvent } from 'rxjs';
import { Loader } from '@components/loader/loader.component';
import { SlicePipe } from '@angular/common';
import { columnSort } from '@pages/dashboard-page/model';

import { CommonModule } from '@angular/common';
import { InputDashboard } from '@components/input-dashboard/input-dashboard-component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { tableHeaders } from 'app/shared/constants/table-headers';
import { Router } from '@angular/router';
import { SaveFavoriteCryptoParsService } from '@core/services/save-favorite-crypto-pars.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    Loader,
    SlicePipe,
    CommonModule,
    InputDashboard,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  @ViewChild('rootRef') rootRef!: ElementRef<HTMLDivElement>;
  private apiService = inject(ApiService);
  private errorServiceService = inject(ErrorServiceService);
  private router = inject(Router);
  private saveFavoriteCryptoParsService = inject(SaveFavoriteCryptoParsService);
  private destroyRef = inject(DestroyRef);

  protected statisticsCryptoPairs = signal<IStatistic[]>([]);
  protected initialStatisticsCryptoPairs = signal<IStatistic[]>([]);
  protected loading = signal(false);
  protected tableHeaders = signal(tableHeaders);
  protected start = signal(0);
  protected rowHeight = signal(40);
  protected visibleRows = signal(10);

  public filtersGroup = new FormGroup({
    checkboxes: new FormArray([new FormControl(false)]),
  });

  ngAfterViewInit() {
    fromEvent(this.rootRef.nativeElement, 'scroll')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const target = res.target as HTMLElement;
        this.start.set(Math.floor(target.scrollTop / this.rowHeight()));
      });
  }

  addToFavorite(cryptoPairs: IStatistic) {
    this.saveFavoriteCryptoParsService.saveCryptoPairs(cryptoPairs);
  }

  showLikedHeart(cryptoPairs: IStatistic) {
    const savedCryptoPars =
      this.saveFavoriteCryptoParsService.arrayFavoriteCryptoPars();
    const foundCryptoPars = savedCryptoPars.find(
      (item) => item.symbol === cryptoPairs.symbol
    );

    if (foundCryptoPars) {
      return 'bi bi-suit-heart-fill text-favorite';
    } else {
      return 'bi bi-suit-heart';
    }
  }

  getSymbol(symbol: string) {
    this.router.navigate(['detail', symbol.toLocaleLowerCase()]);
  }

  ngOnInit() {
    this.loading.set(true);
    this.apiService
      .getStatistics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          this.statisticsCryptoPairs.set(value);
          this.initialStatisticsCryptoPairs.set(value);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorServiceService.setError(err);
          this.loading.set(false);
        },
      });
  }

  handlerCheckboxEvent() {
    const copy = [...this.statisticsCryptoPairs()];
    const checkboxes = this.filtersGroup.controls.checkboxes;
    if (checkboxes.value[0]) {
      copy.sort((a, b) => +b.count - +a.count);
      this.statisticsCryptoPairs.set(copy);
      return;
    }
    this.statisticsCryptoPairs.set(this.initialStatisticsCryptoPairs());
  }

  resetAllSortedColumn() {
    this.tableHeaders().forEach((h) => (h.isSorted = false));
  }

  sortTable(column: columnSort) {
    this.filtersGroup.controls.checkboxes.setValue([false]);
    this.resetAllSortedColumn();
    const copy = [...this.statisticsCryptoPairs()];
    if (column === 'symbol') {
      copy.sort((a, b) => a.symbol.localeCompare(b.symbol));
      this.statisticsCryptoPairs.set(copy);
      this.tableHeaders().forEach((h) => {
        if (h.columnName === 'symbol') {
          h.isSorted = true;
        }
      });
      return;
    }

    copy.sort((a, b) => +b[column] - +a[column]);
    this.tableHeaders().forEach((h) => {
      if (h.columnName === column) {
        h.isSorted = true;
      }
    });
    this.statisticsCryptoPairs.set(copy);
  }

  protected chosenSortedIcon(isSorted: boolean) {
    return isSorted ? 'bi bi-caret-down-fill' : 'bi bi-caret-up-fill';
  }

  get getTopHeight() {
    return this.rowHeight() * this.start();
  }

  get getBottomHeight() {
    return (
      this.rowHeight() *
      (this.statisticsCryptoPairs().length -
        (this.start() + this.visibleRows() + 1))
    );
  }
}
