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
import { CandlestickType, ICandleChart, ISmaSeries, K } from './model';
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

@Component({
  selector: 'app-detail-crypto-pars',
  imports: [FormsModule],
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

  change() {
    this.websocketService.close();
    this.runWebsocket();
  }

  runWebsocket() {
    this.websocketService
      .connect(`${this.slug()}@kline_${this.time()}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const msg = res.k;
        console.log(msg);
        const candle = {
          time: new Date(msg.t).toISOString().split('T')[0],
          open: parseFloat(msg.o),
          high: parseFloat(msg.h),
          low: parseFloat(msg.l),
          close: parseFloat(msg.c),
        };

        const masData: ICandle[] = [];
        masData.push({ close: +msg.c, time: msg.t as UTCTimestamp });

        const smaValues = this.calculateMovingAverageSeriesData(masData, 1);

        const emaValues = this.calculateEMA(masData, 1);
        const lastSma = smaValues[smaValues.length - 1];
        const lastEma = emaValues[emaValues.length - 1];
        this.emaSeries()?.update(lastEma);
        this.smaSeries()?.update(lastSma);
        this.candleSeries()?.update(candle);
      });
  }

  calculateMovingAverageSeriesData(candleData: ICandle[], maLength: number) {
    const maData = [];

    for (let i = 0; i < candleData.length; i++) {
      if (i < maLength) {
        maData.push({ time: candleData[i].time as UTCTimestamp });
      } else {
        let sum = 0;
        for (let j = 0; j < maLength; j++) {
          sum += candleData[i - j].close;
        }
        const maValue = sum / maLength;
        maData.push({
          time: candleData[i].time as UTCTimestamp,
          value: maValue,
        });
      }
    }

    return maData;
  }

  calculateEMA(candles: ICandle[], length: number): LineData<UTCTimestamp>[] {
    if (candles.length < length) {
      return [];
    }
    const k = 2 / (length + 1);
    let emaPrev = candles[0].close;
    const emaData: LineData<UTCTimestamp>[] = [];

    for (let i = 0; i < candles.length; i++) {
      const close = candles[i].close;
      if (i === 0) {
        emaPrev = close;
      } else {
        emaPrev = close * k + emaPrev * (1 - k);
      }
      emaData.push({
        time: candles[i].time as UTCTimestamp,
        value: emaPrev,
      });
    }

    return emaData;
  }
}

interface ICandle {
  time: number;
  close: number;
}
