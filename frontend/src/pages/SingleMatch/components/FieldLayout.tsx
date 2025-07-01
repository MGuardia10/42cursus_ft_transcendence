import React, { RefObject } from "react";
import { GameState } from "@/types/gameTypes";

interface FieldLayoutProps {
  gameRef: RefObject<HTMLDivElement>;
  gameState: GameState;
  finalBgColor: string;
  finalBarColor: string;
  finalBallColor: string;
  finalPointsToWin: number;
  t: (key: string) => string;
  gameData: any;
}

// Define proporciones para paddles y pelota
const PADDLE_WIDTH_RATIO = 0.020; // 2.5% del ancho del campo
const PADDLE_HEIGHT_RATIO = 0.2;  // 20% del alto del campo
const BALL_SIZE_RATIO = 0.027;    // 2.7% del ancho del campo (ajustable)

const FieldLayout: React.FC<FieldLayoutProps> = ({
  gameRef,
  gameState,
  finalBgColor,
  finalBarColor,
  finalBallColor,
  finalPointsToWin,
  t,
  gameData,
}) => {
  return (
    <div className="flex justify-center mb-6">
      <div
        ref={gameRef}
        className="relative rounded-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "auto",
          aspectRatio: "4/3",
          backgroundColor: finalBgColor,
          border: `1px solid ${finalBarColor}`,
        }}
      >
        <div
          className="absolute opacity-50"
          style={{
            left: "50%",
            top: 0,
            width: "2px",
            height: "100%",
            transform: "translateX(-50%)",
            backgroundColor: finalBarColor,
          }}
        />
        <div
          className="absolute rounded-sm"
          style={{
            left: 0,
            top: `${(gameState.playerPaddle.y / gameState.gameHeight) * 100}%`,
            width: `${PADDLE_WIDTH_RATIO * 100}%`,
            height: `${PADDLE_HEIGHT_RATIO * 100}%`,
            backgroundColor: finalBarColor,
          }}
        />
        <div
          className="absolute rounded-sm"
          style={{
            right: 0,
            top: `${(gameState.enemyPaddle.y / gameState.gameHeight) * 100}%`,
            width: `${PADDLE_WIDTH_RATIO * 100}%`,
            height: `${PADDLE_HEIGHT_RATIO * 100}%`,
            backgroundColor: finalBarColor,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: `${(gameState.ball.x / gameState.gameWidth) * 100}%`,
            top: `${(gameState.ball.y / gameState.gameHeight) * 100}%`,
            width: `${BALL_SIZE_RATIO * 100}%`,
            height: `${(BALL_SIZE_RATIO * gameState.gameWidth / gameState.gameHeight) * 100}%`,
            backgroundColor: finalBallColor,
          }}
        />
        {!gameState.gamePaused && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="mb-2 text-xl font-bold text-text-tertiary drop-shadow">
              {t("firstToScore").replace("{score}", finalPointsToWin.toString())}
            </div>
            <div className="text-base text-text-primary">
              {gameState.gameScore.player === 0 && gameState.gameScore.enemy === 0
                ? t("pressToStart")
                : gameState.gameScore.player >= finalPointsToWin
                ? `${gameData?.player1.alias || "Player 1"} ${t("wins")}`
                : gameState.gameScore.enemy >= finalPointsToWin
                ? `${gameData?.player2.alias || "Player 2"} ${t("wins")}`
                : t("gamePaused")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldLayout; 