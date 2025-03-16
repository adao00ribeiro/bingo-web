export interface IAccumulated {
  activated: boolean;
  minimumValue: number;
  maximumValue: number;
  currentValue: number;
  maximumNumberOfBalls: number;
  cumulativePercentage: number;
  incrementBallCumulative: boolean;
  roomId: string;
}
