import { ITableHeaders } from '@pages/model';

export const tableHeaders: ITableHeaders[] = [
  {
    text: 'Symbol',
    columnName: 'symbol',
    isSorted: false,
  },
  {
    text: 'Last price',
    columnName: 'lastPrice',
    isSorted: false,
  },
  {
    text: 'Price change %',
    columnName: 'priceChangePercent',
    isSorted: false,
  },
  {
    text: 'Volume',
    columnName: 'volume',
    isSorted: false,
  },
];
