export type PlayerSettings = {
  default: number;
  pointToWin: number;
  serveDelay: number;
  bgColor: string;
  barColor: string;
  ballColor: string;
};

export type Player = {
  active: number;
  configuration: PlayerSettings;
  winCount: number;
  loseCount: number;
  winPointsCount: number;
  losePointsCount: number;
};
