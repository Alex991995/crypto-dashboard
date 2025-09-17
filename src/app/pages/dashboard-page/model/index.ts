export type columnSort =
  | 'symbol'
  | 'lastPrice'
  | 'priceChangePercent'
  | 'volume';

export interface ITableHeaders {
  text: string;
  columnName: columnSort;
  isSorted: boolean;
}
