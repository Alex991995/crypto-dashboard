import { UTCTimestamp } from 'lightweight-charts';
import { ICandle } from '../model';

export function calculateMovingAverageSeriesData(
  candleData: ICandle[],
  maLength: number
) {
  const maData = [];

  for (let i = 0; i < candleData.length; i++) {
    if (i < maLength) {
      maData.push({ time: candleData[i].time as UTCTimestamp });
    } else {
      let sum = 0;
      for (let j = 0; j < maLength; j++) {
        sum += candleData[i - j].close;
      }
      const maValue = sum / maLength;
      maData.push({
        time: candleData[i].time as UTCTimestamp,
        value: maValue,
      });
    }
  }

  return maData;
}
