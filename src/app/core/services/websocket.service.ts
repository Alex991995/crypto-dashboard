import { Injectable } from '@angular/core';
import { ICandleChart } from '@pages/detail-crypto-pars/model';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$?: WebSocketSubject<any>;
  private readonly url = 'wss://fstream.binance.com/ws';

  connect(stream: string) {
    console.log(stream);
    this.socket$ = webSocket(`${this.url}/${stream}`);
    return this.socket$ as WebSocketSubject<ICandleChart>;
  }

  close() {
    this.socket$?.complete();
  }
}
