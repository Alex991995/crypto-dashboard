import {
  CandlestickData,
  CandlestickSeriesOptions,
  CandlestickStyleOptions,
  DeepPartial,
  ISeriesApi,
  LineData,
  LineSeriesOptions,
  LineStyleOptions,
  SeriesOptionsCommon,
  Time,
  WhitespaceData,
} from 'lightweight-charts';

export type CandlestickType = ISeriesApi<
  'Candlestick',
  Time,
  CandlestickData<Time> | WhitespaceData<Time>,
  CandlestickSeriesOptions,
  DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon>
>;

export type ISmaSeries = ISeriesApi<
  'Line',
  Time,
  WhitespaceData<Time> | LineData<Time>,
  LineSeriesOptions,
  DeepPartial<LineStyleOptions & SeriesOptionsCommon>
>;

export interface ICandleChart {
  e: string;
  E: number;
  s: string;
  k: K;
}

export interface K {
  t: number;
  T: number;
  s: string;
  i: string;
  f: number;
  L: number;
  o: string;
  c: string;
  h: string;
  l: string;
  v: string;
  n: number;
  x: boolean;
  q: string;
  V: string;
  Q: string;
  B: string;
}
