import { Injectable, OnInit, signal } from '@angular/core';
import { IStatistic } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SaveFavoriteCryptoParsService {
  getSavedCrypto = localStorage.getItem('favorite-crypto') || '[]';
  arrayFavoriteCryptoPars = signal<IStatistic[] | []>(
    JSON.parse(this.getSavedCrypto)
  );

  saveCryptoPairs(cryptoPairs: IStatistic) {
    this.arrayFavoriteCryptoPars.update((prev) => {
      const exists = prev.find((item) => item.symbol === cryptoPairs.symbol);
      if (exists) {
        return prev.filter((item) => item.symbol !== exists.symbol);
      } else {
        return [...prev, cryptoPairs];
      }
    });
    localStorage.setItem(
      'favorite-crypto',
      JSON.stringify(this.arrayFavoriteCryptoPars())
    );
  }

  deleteCryptoPairs(symbol: string) {
    this.arrayFavoriteCryptoPars.update((prev) => {
      return prev.filter((item) => item.symbol !== symbol);
    });
    localStorage.setItem(
      'favorite-crypto',
      JSON.stringify(this.arrayFavoriteCryptoPars())
    );
  }
}
