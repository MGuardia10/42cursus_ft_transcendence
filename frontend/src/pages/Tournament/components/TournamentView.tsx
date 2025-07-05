import React from "react";
import type {
  Tournament,
  Match,
  Player,
  TournamentView,
} from "@/types/tournamentTypes";

interface TournamentViewProps {
  currentTournament: Tournament | null;
  setCurrentView: (view: TournamentView) => void;
  t: (key: any) => string;
  participants: Player[];
  handleStartTournament: () => void;
  handlePlayMatch: (matchId: string) => void;
  user: any;
}

const TournamentView: React.FC<TournamentViewProps> = ({
  currentTournament,
  setCurrentView,
  t,
  participants,
  handleStartTournament,
  handlePlayMatch,
  user,
}) => {
  if (!currentTournament) return null;

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return t("tournament_final");
    if (round === totalRounds - 1) return t("tournament_semifinal");
    if (round === totalRounds - 2) return t("tournament_quarterfinal");
    return t("tournament_round").replace("{round}", String(round));
  };

  const totalRounds = Math.log2(currentTournament.maxPlayers);
  const rounds: Match[][] = [];

  for (let round = 1; round <= totalRounds; round++) {
    rounds.push(
      currentTournament.matches.filter((match) => match.round === round)
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView("main")}
              className="text-text-secondary hover:text-text-primary mr-4 cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h2 className="text-3xl font-bold text-text-primary">
                {t("tournament_title")} #{currentTournament.id}
              </h2>
              <p className="text-text-secondary">
                {t("tournament_players_label")
                  .replace("{current}", String(participants.length))
                  .replace("{max}", String(currentTournament.maxPlayers))}
              </p>
            </div>
          </div>
          {currentTournament.status === "waiting" &&
            currentTournament.createdBy === Number(user?.id) && (
              <button
                onClick={handleStartTournament}
                disabled={participants.length < currentTournament.maxPlayers}
                className="bg-text-tertiary text-background-primary py-2 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {t("start_tournament")}
              </button>
            )}
        </div>
        {/* Tournament Status */}
        <div className="bg-background-secondary rounded-lg p-4 mb-8 border border-border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  currentTournament.status === "waiting"
                    ? "bg-yellow-500"
                    : currentTournament.status === "active"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              />
              <span className="text-text-primary font-semibold">
                {currentTournament.status === "waiting" &&
                  t("tournament_waiting_for_players")}
                {currentTournament.status === "active" &&
                  t("tournament_active")}
                {currentTournament.status === "finished" &&
                  t("tournament_finished")}
              </span>
            </div>
            <div className="text-text-secondary">
              {t("tournament_code")}:{" "}
              <code className="font-mono">{currentTournament.id}</code>
            </div>
          </div>
        </div>
        {/* Tournament Bracket */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
          <div className="overflow-x-auto">
            <div className="flex space-x-8 min-w-max">
              {rounds.map((roundMatches, roundIndex) => (
                <div
                  key={roundIndex}
                  className="flex flex-col space-y-4 min-w-[300px]"
                >
                  <h3 className="text-text-primary font-bold text-center mb-4">
                    {getRoundName(roundIndex + 1, totalRounds)}
                  </h3>
                  {roundMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-background-primary rounded-lg p-4 border border-border-primary"
                    >
                      {/* Player 1 */}
                      <div
                        className={`flex items-center space-x-3 p-3 rounded ${
                          match.winner?.id === match.player1?.id
                            ? "bg-background-secondary bg-opacity-20"
                            : ""
                        }`}
                      >
                        {match.player1 ? (
                          <>
                            <img
                              src={match.player1.avatar || "/placeholder.webp"}
                              alt={match.player1.alias}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-text-primary font-medium">
                              {match.player1.alias}
                            </span>
                          </>
                        ) : (
                          <span className="text-text-secondary italic">
                            {t("tournament_empty_slot")}
                          </span>
                        )}
                      </div>
                      <div className="text-center text-text-secondary text-sm py-2">
                        {t("tournament_vs")}
                      </div>
                      {/* Player 2 */}
                      <div
                        className={`flex items-center space-x-3 p-3 rounded ${
                          match.winner?.id === match.player2?.id
                            ? "bg-background-secondary bg-opacity-20"
                            : ""
                        }`}
                      >
                        {match.player2 ? (
                          <>
                            <img
                              src={match.player2.avatar || "/placeholder.webp"}
                              alt={match.player2.alias}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-text-primary font-medium">
                              {match.player2.alias}
                            </span>
                          </>
                        ) : (
                          <span className="text-text-secondary italic">
                            {t("tournament_empty_slot")}
                          </span>
                        )}
                      </div>
                      {/* Play Button */}
                      {match.player1 &&
                        match.player2 &&
                        !match.winner &&
                        currentTournament.status === "active" && (
                          <button
                            onClick={() => handlePlayMatch(match.id)}
                            className="w-full mt-4 bg-text-tertiary text-background-primary py-2 px-4 rounded font-semibold hover:bg-opacity-80 transition-colors"
                          >
                            {t("tournament_play")}
                          </button>
                        )}
                      {match.winner && (
                        <div className="text-center mt-4 text-green-500 font-semibold">
                          {t("tournament_winner").replace(
                            "{alias}",
                            match.winner.alias
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Current Players */}
        <div className="mt-8 bg-background-secondary rounded-xl p-6 border border-border-primary">
          <h3 className="text-text-primary font-bold mb-4">
            {t("tournament_current_players")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Participants */}
            {participants.map((player) => (
              <div
                key={player.id}
                className="flex items-center space-x-3 p-3 bg-background-primary rounded-lg border border-border-primary"
              >
                <img
                  src={player.avatar || "/placeholder.webp"}
                  alt={player.alias}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-text-primary font-medium">
                  {player.alias}
                </span>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({
              length: currentTournament.maxPlayers - participants.length,
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center space-x-3 p-3 bg-background-primary rounded-lg border border-border-primary border-dashed"
              >
                <div className="w-8 h-8 rounded-full bg-background-secondary" />
                <span className="text-text-secondary italic">
                  {t("tournament_empty_slot")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentView;
