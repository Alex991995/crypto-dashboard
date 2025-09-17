import { LineData, UTCTimestamp } from 'lightweight-charts';
import { ICandle } from '../model';

export function calculateEMA(
  candles: ICandle[],
  length: number
): LineData<UTCTimestamp>[] {
  if (candles.length < length) {
    return [];
  }
  const k = 2 / (length + 1);
  let emaPrev = candles[0].close;
  const emaData: LineData<UTCTimestamp>[] = [];

  for (let i = 0; i < candles.length; i++) {
    const close = candles[i].close;
    if (i === 0) {
      emaPrev = close;
    } else {
      emaPrev = close * k + emaPrev * (1 - k);
    }
    emaData.push({
      time: candles[i].time as UTCTimestamp,
      value: emaPrev,
    });
  }

  return emaData;
}
