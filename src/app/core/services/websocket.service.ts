import { Injectable } from '@angular/core';
import { IOrderBooK, IWebSocketData } from '@pages/detail-crypto-pars/model';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$?: WebSocketSubject<any>;
  private readonly url = 'wss://fstream.binance.com/stream?';

  connect(stream: string) {
    this.socket$ = webSocket(`${this.url}streams=${stream}`);
    return this.socket$ as WebSocketSubject<IWebSocketData<unknown>>;
  }

  close() {
    this.socket$?.complete();
  }
}
