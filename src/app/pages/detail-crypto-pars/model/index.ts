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

export interface  IBidAskSpread {
  oldValue: string | null;
  newValue: string;
  volume: string;
  'class-animation': string | null;
}


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

export interface IWebSocketData<T> {
  stream: string;
  data: T;
}

export interface IOrderBooK {
  e: string;
  E: number;
  T: number;
  s: string;
  U: number;
  u: number;
  pu: number;
  b: string[][];
  a: string[][];
}

export interface ICandleChart {
  e: string;
  E: number;
  s: string;
  k: K;
}

export interface IAggTrade {
  e: string;
  E: number;
  a: number;
  s: string;
  p: string;
  q: string;
  f: number;
  l: number;
  T: number;
  m: boolean;
}

export interface IStatisticsPrice24h {
  e: string;
  E: number;
  s: string;
  p: string;
  P: string;
  w: string;
  c: string;
  Q: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
  O: number;
  C: number;
  F: number;
  L: number;
  n: number;
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

export interface ICandle {
  time: number;
  close: number;
}
