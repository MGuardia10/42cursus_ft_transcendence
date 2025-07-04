import React from "react";

interface GameControlsProps {
  gameState: any;
  gameEnded: boolean;
  gameLoading: boolean;
  onStart: () => void;
  onPause: () => void;
  onBackToHome: () => void;
  t: (key: string) => string;
  finalPointsToWin: number;
  gameData: any;
  gameError?: { message: string } | null;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  gameEnded,
  gameLoading,
  onStart,
  onPause,
  onBackToHome,
  t,
  finalPointsToWin,
  gameData,
  gameError,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        {gameState.gameScore.player < finalPointsToWin &&
          gameState.gameScore.enemy < finalPointsToWin && (
            <>
              {gameState.gameScore.player === 0 &&
              gameState.gameScore.enemy === 0 &&
              !gameState.gamePaused ? (
                <button
                  onClick={onStart}
                  disabled={gameLoading}
                  className="px-6 py-3 bg-text-tertiary text-background-primary rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
                >
                  {gameLoading ? "Creating Game..." : t("start")}
                </button>
              ) : (
                <button
                  onClick={onPause}
                  className="px-6 py-3 bg-text-tertiary text-background-primary rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
                >
                  {gameState.gamePaused ? t("pause") : t("resume")}
                </button>
              )}
            </>
          )}
      </div>
      <div className="text-center text-text-secondary text-sm max-w-md">
        <p className="mb-2">
          {gameData?.player1.alias || "Jugador 1"}: W/S | {gameData?.player2.alias || "Jugador 2"}: O/L
        </p>
        {gameError && (
          <p className="text-red-400 mt-2">Error: {gameError.message}</p>
        )}
      </div>
      {gameError && (
        <div className="text-center text-red-400 text-sm mt-2">Error: {gameError.message}</div>
      )}
      {gameEnded && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onBackToHome}
            className="px-6 py-3 bg-text-tertiary text-background-primary rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
          >
            {t("backToHome")}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameControls; 