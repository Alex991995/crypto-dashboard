import { Component, inject, signal } from '@angular/core';
import { SaveFavoriteCryptoParsService } from '@core/services/save-favorite-crypto-pars.service';
import { tableHeaders } from 'app/shared/constants/table-headers';

@Component({
  selector: 'app-favorite',
  imports: [],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent {
  private saveFavoriteCryptoParsService = inject(SaveFavoriteCryptoParsService);
  protected cryptoPairs =
    this.saveFavoriteCryptoParsService.arrayFavoriteCryptoPars;
  protected tableHeaders = signal(tableHeaders);

  handleDeleteEvent(symbol: string) {
    this.saveFavoriteCryptoParsService.deleteCryptoPairs(symbol);
  }
}
