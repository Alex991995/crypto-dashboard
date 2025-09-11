import { Injectable, signal } from '@angular/core';
import { IStatistic } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SaveFavoriteCryptoParsService {
  arrayFavoriteCryptoPars = signal<IStatistic[]>([]);

  saveCryptoPairs(cryptoPairs: IStatistic) {
    this.arrayFavoriteCryptoPars.update((prev) => [...prev, cryptoPairs]);
  }
}
