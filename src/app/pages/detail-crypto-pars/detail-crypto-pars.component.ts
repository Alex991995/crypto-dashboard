import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '@core/services/websocket.service';
import {
  CandlestickType,
  IAggTrade,
  ICandle,
  ICandleChart,
  IOrderBooK,
  ISmaSeries,
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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-crypto-pars',
  imports: [FormsModule, DatePipe],
  templateUrl: './detail-crypto-pars.component.html',
  styleUrl: './detail-crypto-pars.component.scss',
})
export class DetailCryptoParsComponent implements OnInit {
  private websocketService = inject(WebsocketService);
  private destroyRef = inject(DestroyRef);
  protected slug = input.required<string>();
  private candleSeries = signal<CandlestickType | undefined>(undefined);
  private smaSeries = signal<ISmaSeries | undefined>(undefined);
  private emaSeries = signal<ISmaSeries | undefined>(undefined);
  protected chartNode = viewChild.required<ElementRef<HTMLDivElement>>('chart');
  protected time = signal('1m');
  protected arrayTimeCandle = signal(arrayTimeCandle).asReadonly();

  protected arrayAsks = signal<string[][]>([]);
  protected aggData = signal<IAggTrade | undefined>(undefined);

  ngOnInit() {
    const chart = createChart(this.chartNode().nativeElement, {
      width: 600,
      height: 400,
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

    this.smaSeries.set(smaSeries);
    this.emaSeries.set(emaSeries);
    this.candleSeries.set(candleSeries);
    this.runWebsocket();
  }

  changeEventSelector() {
    this.websocketService.close();
    this.runWebsocket();
    this.resetAllWebsocketData();
  }

  runWebsocket() {
    this.websocketService
      .connect(
        `${this.slug()}@kline_${this.time()}/${this.slug()}@depth20@100ms/${this.slug()}@aggTrade`
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res.stream === `${this.slug()}@kline_${this.time()}`) {
          console.log(res.stream);
          this.createChartCandles(res as IWebSocketData<ICandleChart>);
        } else if (res.stream === `${this.slug()}@depth20@100ms`) {
          this.createOrderTable(res as IWebSocketData<IOrderBooK>);
        } else if (res.stream === `${this.slug()}@aggTrade`) {
          const aggData = res.data as IAggTrade;
          console.log(res);
          this.aggData.set(aggData);
        }
      });
  }

  resetAllWebsocketData() {
    this.candleSeries()?.setData([]);
    this.smaSeries()?.setData([]);
    this.emaSeries()?.setData([]);
  }

  createOrderTable(res: IWebSocketData<IOrderBooK>) {
    this.arrayAsks.set(res.data.a);
  }

  createChartCandles(res: IWebSocketData<ICandleChart>) {
    const msg = res.data.k;
    const candle = {
      time: new Date(msg.t).toISOString().split('T')[0],
      open: parseFloat(msg.o),
      high: parseFloat(msg.h),
      low: parseFloat(msg.l),
      close: parseFloat(msg.c),
    };

    const masData: ICandle[] = [];
    masData.push({ close: +msg.c, time: msg.t as UTCTimestamp });

    const smaValues = calculateMovingAverageSeriesData(masData, 1);

    const emaValues = calculateEMA(masData, 1);
    const lastSma = smaValues[smaValues.length - 1];
    const lastEma = emaValues[emaValues.length - 1];

    this.emaSeries()?.update(lastEma);
    this.smaSeries()?.update(lastSma);
    this.candleSeries()?.update(candle);
  }
  showPlaceholder(loadingData: boolean) {
    if (loadingData) {
      return 'placeholder col-12 bg-secondary';
    }
    return null;
  }
}
