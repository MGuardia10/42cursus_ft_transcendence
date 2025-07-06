import React from "react";

interface PlayerInfo {
  id: string;
  alias: string;
}

interface ScoreboardProps {
  player1: PlayerInfo;
  player2: PlayerInfo;
  score: { player: number; enemy: number };
}

const Scoreboard: React.FC<ScoreboardProps> = ({ player1, player2, score }) => {
  return (
    <div className="flex justify-center items-center mb-6 bg-background-secondary rounded-lg p-4">
      <div className="text-center mx-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src={`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${player1.id}/avatar`}
            alt={player1.alias || "Jugador 1"}
            className="w-8 h-8 rounded-full border border-text-tertiary object-cover"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
            crossOrigin="use-credentials"
          />
          <div className="text-text-secondary text-sm">
            {player1.alias || "Jugador 1"}
          </div>
        </div>
        <div className="text-3xl font-bold text-text-tertiary">
          {score.player}
        </div>
      </div>
      <div className="text-2xl text-text-primary mx-4">-</div>
      <div className="text-center mx-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src={`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${player2.id}/avatar`}
            alt={player2.alias || "Jugador 2"}
            className="w-8 h-8 rounded-full border border-text-tertiary object-cover"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
            crossOrigin="use-credentials"
          />
          <div className="text-text-secondary text-sm">
            {player2.alias || "Jugador 2"}
          </div>
        </div>
        <div className="text-3xl font-bold text-text-tertiary">
          {score.enemy}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard; 