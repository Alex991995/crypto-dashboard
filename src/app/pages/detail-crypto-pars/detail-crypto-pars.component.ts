import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '@core/services/websocket.service';
import { CandlestickType } from './model';
import { CandlestickSeries, createChart } from 'lightweight-charts';
import { arrayTimeCandle } from 'app/shared/constants/arrayTimeCandle';

@Component({
  selector: 'app-detail-crypto-pars',
  imports: [FormsModule],
  templateUrl: './detail-crypto-pars.component.html',
  styleUrl: './detail-crypto-pars.component.scss',
})
export class DetailCryptoParsComponent implements OnInit {
  private websocketService = inject(WebsocketService);
  private candleSeries = signal<CandlestickType | undefined>(undefined);
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

    this.candleSeries.set(candleSeries);
    this.runWebsocket();
  }

  change() {
    this.websocketService.close();
    this.runWebsocket();
  }

  runWebsocket() {
    this.websocketService
      .connect(`bnbusdt@kline_${this.time()}`)
      .subscribe((res) => {
        const msg = res.k;

        const candle = {
          time: new Date(msg.t).toISOString().split('T')[0],
          open: parseFloat(msg.o),
          high: parseFloat(msg.h),
          low: parseFloat(msg.l),
          close: parseFloat(msg.c),
        };

        this.candleSeries()?.update(candle);
      });
  }
}
