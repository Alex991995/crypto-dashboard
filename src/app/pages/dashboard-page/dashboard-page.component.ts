import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ErrorServiceService } from '@core/services/error-service.service';
import { IStatistic } from 'app/interfaces';
import { first, fromEvent, map, take } from 'rxjs';
import { Loader } from '@components/loader/loader.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  imports: [Loader, SlicePipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private apiService = inject(ApiService);
  private errorServiceService = inject(ErrorServiceService);

  protected statisticsCryptoPairs = signal<IStatistic[]>([]);
  protected loading = signal(false);
  @ViewChild('rootRef') rootRef!: ElementRef<HTMLDivElement>;

  start = signal(0);
  rowHeight = signal(40);
  visibleRows = signal(10);

  ngAfterViewInit() {
    fromEvent(this.rootRef.nativeElement, 'scroll').subscribe((res) => {
      const target = res.target as HTMLElement;
      this.start.set(Math.floor(target.scrollTop / this.rowHeight()));
    });
  }

  ngOnInit() {
    this.loading.set(true);
    this.apiService.getStatistics().subscribe({
      next: (value) => {
        this.statisticsCryptoPairs.set(value);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorServiceService.setError(err);
        this.loading.set(false);
      },
    });
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
