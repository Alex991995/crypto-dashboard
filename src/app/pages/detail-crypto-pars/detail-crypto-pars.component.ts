import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '@core/services/websocket.service';
import {
  CandlestickType,
  IAggTrade,
  IBidAskSpread,
  ICandle,
  ICandleChart,
  IHistoryCandle,
  IOrderBooK,
  ISmaSeries,
  IStatisticsPrice24h,
  IWebSocketData,
  K,
} from './model';
import {
  CandlestickSeries,
  createChart,
  LineData,
  LineSeries,
  UTCTimestamp,
  WhitespaceData,
} from 'lightweight-charts';
import { arrayTimeCandle } from 'app/shared/constants/arrayTimeCandle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { calculateEMA } from './helpers/calculate-ema';
import { calculateMovingAverageSeriesData } from './helpers/calculate-moving-average-series-data';
import { AggTableTransactionComponent } from 'app/features/detail-tables/agg-table-transaction/agg-table-transaction.component';
import { StatisticsPriceTableComponent } from 'app/features/detail-tables/statistics-price-table/statistics-price-table.component';
import { ToggleThemeComponent } from '@components/toggle-theme/toggle-theme.component';
import { OrderBookComponent } from 'app/features/detail-tables/order-book/order-book.component';
import { SaveFavoriteCryptoParsService } from '@core/services/save-favorite-crypto-pars.service';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-detail-crypto-pars',
  imports: [
    RouterLink,
    FormsModule,
    AggTableTransactionComponent,
    StatisticsPriceTableComponent,
    ToggleThemeComponent,
    OrderBookComponent,
  ],
  templateUrl: './detail-crypto-pars.component.html',
  styleUrl: './detail-crypto-pars.component.scss',
})
export class DetailCryptoParsComponent implements OnInit {
  private websocketService = inject(WebsocketService);
  private destroyRef = inject(DestroyRef);
  private apiService = inject(ApiService);

  protected slug = input.required<string>();
  private candleSeries = signal<CandlestickType | undefined>(undefined);
  private smaSeries = signal<ISmaSeries | undefined>(undefined);
  private emaSeries = signal<ISmaSeries | undefined>(undefined);
  protected chartNode = viewChild.required<ElementRef<HTMLDivElement>>('chart');
  protected time = signal('1m');
  protected arrayTimeCandle = signal(arrayTimeCandle).asReadonly();

  protected arrayAsks = signal<IBidAskSpread[]>([]);
  protected arrayBids = signal<IBidAskSpread[]>([]);
  public aggData = signal<IAggTrade | undefined>(undefined);
  protected statisticsPrice24h = signal<IStatisticsPrice24h | undefined>(
    undefined
  );

  private streamCandle = computed(() => `${this.slug()}@kline_${this.time()}`);
  private streamOrderBook = computed(() => `${this.slug()}@depth20@100ms`);
  private streamAggTrade = computed(() => `${this.slug()}@aggTrade`);
  private streamStatisticsPrice = computed(() => `${this.slug()}@ticker`);
  private masData = signal<ICandle[]>([]);

  ngOnInit() {
    const chart = createChart(this.chartNode().nativeElement, {
      width: 600,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      localization: {
        timeFormatter: (time: number) => {
          return new Date(time * 1000).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        },
      },
    });
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    const smaSeries = chart.addSeries(LineSeries, {
      color: 'blue',
      lineWidth: 2,
    });

    const emaSeries = chart.addSeries(LineSeries, {
      color: 'red',
      lineWidth: 2,
    });
    this.getHistoryCandles();
    this.smaSeries.set(smaSeries);
    this.emaSeries.set(emaSeries);
    this.candleSeries.set(candleSeries);

    this.runWebsocket();
  }

  changeEventSelector() {
    this.websocketService.close();
    this.getHistoryCandles();
    this.runWebsocket();
    this.resetAllWebsocketData();
  }

  getHistoryCandles() {
    this.apiService
      .getHistoryCandles(this.slug(), this.time())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const arrayIndicators = res.map((item) => ({
          close: parseFloat(item[4]),
          time: Math.floor(item[0] / 1000) as UTCTimestamp,
        }));
        this.masData.set(arrayIndicators);

        const candles = res.map((d) => ({
          time: Math.floor(d[0] / 1000) as UTCTimestamp,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        this.candleSeries()?.setData(candles);
      });
    const smaValues = calculateMovingAverageSeriesData(this.masData(), 14);
    const emaValues = calculateEMA(this.masData(), 14);

    this.smaSeries()?.setData(smaValues);
    this.emaSeries()?.setData(emaValues);
  }

  runWebsocket() {
    this.websocketService
      .connect(
        `${this.streamCandle()}/${this.streamOrderBook()}/${this.streamAggTrade()}/${this.streamStatisticsPrice()}`
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res.stream === this.streamCandle()) {
          this.createChartCandles(res as IWebSocketData<ICandleChart>);
        } else if (res.stream === this.streamOrderBook()) {
          this.createOrderTable(res as IWebSocketData<IOrderBooK>);
        } else if (res.stream === this.streamAggTrade()) {
          const aggData = res.data as IAggTrade;
          this.aggData.set(aggData);
        } else {
          this.statisticsPrice24h.set(res.data as IStatisticsPrice24h);
        }
      });
  }

  resetAllWebsocketData() {
    this.candleSeries()?.setData([]);
    this.smaSeries()?.setData([]);
    this.emaSeries()?.setData([]);
  }

  createOrderTable(res: IWebSocketData<IOrderBooK>) {
    if (this.arrayAsks().length === 0) {
      this.setFirstDataInBidAskPrice(res, this.arrayAsks);
    } else {
      this.changeOnNewBidAskPrice(res.data.a, this.arrayAsks);
    }

    if (this.arrayBids().length === 0) {
      this.setFirstDataInBidAskPrice(res, this.arrayBids);
    } else {
      this.changeOnNewBidAskPrice(res.data.b, this.arrayBids);
    }
  }

  setFirstDataInBidAskPrice(
    res: IWebSocketData<IOrderBooK>,
    arrayBidOrAsk: WritableSignal<IBidAskSpread[]>
  ) {
    const firstData = res.data.a.map((item) => ({
      oldValue: null,
      newValue: item[0],
      volume: item[1],
      'class-animation': null,
    }));
    arrayBidOrAsk.set(firstData);
  }

  changeOnNewBidAskPrice(
    stream: string[][],
    arrayBidOrAsk: WritableSignal<IBidAskSpread[]>
  ) {
    arrayBidOrAsk.update((prev) => {
      return prev.map((oldData, i) => {
        const newPrice = stream[i][0];
        const newVolume = stream[i][1];
        if (newPrice !== oldData.newValue) {
          const newObj: IBidAskSpread = {
            oldValue: oldData.newValue,
            newValue: newPrice,
            volume: newVolume,
            'class-animation': '',
          };
          if (newPrice < oldData.newValue) {
            newObj['class-animation'] = 'flash-red';
          } else {
            newObj['class-animation'] = 'flash-green';
          }
          return newObj;
        }

        return oldData;
      });
    });
  }

  createChartCandles(res: IWebSocketData<ICandleChart>) {
    const msg = res.data.k;
    const candle = {
      time: Math.floor(msg.t / 1000) as UTCTimestamp, //
      open: parseFloat(msg.o),
      high: parseFloat(msg.h),
      low: parseFloat(msg.l),
      close: parseFloat(msg.c),
    };

    this.masData.update((item) => [
      ...item,
      { close: +msg.c, time: msg.t as UTCTimestamp },
    ]);

    const smaValues = calculateMovingAverageSeriesData(this.masData(), 14); // например, 14
    const emaValues = calculateEMA(this.masData(), 14);

    const lastSma = smaValues[smaValues.length - 1];
    const lastEma = emaValues[emaValues.length - 1];

    this.emaSeries()?.update(lastEma);
    this.smaSeries()?.update(lastSma);
    this.candleSeries()?.update(candle);
  }
}
