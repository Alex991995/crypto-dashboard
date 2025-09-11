import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },
  {
    path: 'detail/:slug',
    loadComponent: () =>
      import('@pages/detail-crypto-pars/detail-crypto-pars.component').then(
        (m) => m.DetailCryptoParsComponent
      ),
  },
  {
    path: 'favorite',
    loadComponent: () =>
      import('@pages/favorite/favorite.component').then(
        (m) => m.FavoriteComponent
      ),
  },
];
