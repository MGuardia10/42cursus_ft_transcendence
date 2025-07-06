// CONSTANTS
export const PADDLE_HEIGHT = 80;
export const PADDLE_WIDTH = 12;
export const BALL_SIZE = 12;
export const PADDLE_SPEED = 3;
export const BALL_SPEED = 1;

// Interfaces
export interface PlayerData {
  id: string;
  name?: string;
  alias: string;
  avatar?: string;
}

export interface GameData {
  player1: PlayerData;
  player2: PlayerData;
  gameId?: number;
}

export interface GameState {
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
  };
  playerPaddle: {
    y: number;
  };
  enemyPaddle: {
    y: number;
    direction: number;
  };
  gameScore: {
    player: number;
    enemy: number;
  };
  gamePaused: boolean;
  gameWidth: number;
  gameHeight: number;
  ballSpeedMultiplier?: number;
}
