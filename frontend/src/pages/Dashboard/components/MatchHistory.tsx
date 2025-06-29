import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useUserMatches } from "@/hooks/useUserMatches";
import { DashboardProps } from "@/types/dashboardProps";
import { EnrichedMatch } from "@/types/matchTypes";

const MatchHistory: React.FC<DashboardProps> = ({ id }) => {
  // useLanguage hook
  const { t } = useLanguage();

  // useUserMatches hook
  const { matches, error } = useUserMatches(id);

  // useState hook
  const [selectedGame, setSelectedGame] = useState<EnrichedMatch | null>(null);
  const [showFullView, setShowFullView] = useState(false);

  if (error || matches?.length === 0) {
    return (
      <div className="min-h-44 md:min-h-90  flex-col w-full  p-6 justify-center items-center h-full overflow-hidden">
        <h2 className="md:text-xl mb-2">{t("dashboard_match_history")}</h2>
        <div className="flex flex-col items-center justify-center h-44 md:h-90">
          <p className="text-text-secondary text-center">
            {t("dashboard_no_data")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full p-6 h-full">
      {/* Title */}
      <h2 className="md:text-xl mb-2">{t("dashboard_match_history")}</h2>
      {/* Matches */}
      <div className="flex flex-col gap-3 max-h-auto overflow-y-auto scrollbar scrollbar-thumb-background-secondary scrollbar-track-background-primary">
        {matches &&
          matches.map((game, index) => (
            // Game Card
            <div
              key={index}
              className={`flex items-center justify-between py-2.5 px-4 rounded-md hover:cursor-pointer ${
                game.status === "Won"
                  ? "bg-[#4cbfa2] border-2 border-[#2ba384]"
                  : game.status === "Tie"
                  ? "bg-[#7e7a7a] border-2 border-gray-600"
                  : "bg-[#d75743] border-2 border-[#c53e29]"
              }`}
              onClick={() => {
                setSelectedGame(game);
                setShowFullView(true);
              }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={game.playerA.avatarUrl}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.webp";
                  }}
                  crossOrigin="use-credentials"
                  alt={game.playerA.alias}
                  className="w-10 h-10 rounded-full border-2 border-text-tertiary"
                />
              </div>
              <p className="font-bold">
                {game.playerA.score} - {game.playerB.score}
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={game.playerB.avatarUrl}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.webp";
                  }}
                  crossOrigin="use-credentials"
                  alt={game.playerB.alias}
                  className="w-10 h-10 rounded-full border-2 border-text-tertiary"
                />
              </div>
            </div>
          ))}
      </div>
      {/* Game Details */}
      {selectedGame && (
        <div
          className={`absolute top-0 left-0 w-full h-full flex items-center justify-center bg-background-primary/90 z-9 overflow-x-hidden transition-all duration-200 ${
            showFullView
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 invisible"
          }`}
          onClick={() => setShowFullView(false)}
        >
          <div
            className={`bg-background-secondary flex flex-col items-center justify-center gap-6 md:gap-12 lg:gap-14 py-5 px-10 lg:py-10 lg:px-30 rounded-xs border ${
              selectedGame.status === "Won"
                ? "border-border-primary"
                : selectedGame.status === "Tie"
                ? "border-gray-600"
                : "border-red-600"
            } `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* title */}
            <h3 className="text-xl font-bold">
              {t("dashboard_match_details")}
            </h3>

            {/* Details */}
            <div className="flex flex-row gap-10 lg:gap-16 mt-4">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={selectedGame.playerA.avatarUrl}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.webp";
                  }}
                  crossOrigin="use-credentials"
                  alt={selectedGame.playerA.alias}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-text-tertiary"
                />
                <p className="text-sm md:text-base">
                  {selectedGame.playerA.alias}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <p className="md:text-lg font-bold">
                  {selectedGame.playerA.score} - {selectedGame.playerB.score}
                </p>
                <p
                  className={`text-sm ${
                    selectedGame.status === "Won"
                      ? "text-text-tertiary"
                      : selectedGame.status === "Tie"
                      ? "text-gray-400"
                      : "text-red-600"
                  }`}
                >
                  {selectedGame.status === "Won"
                    ? "You won!"
                    : selectedGame.status === "Tie"
                    ? "You Tie!"
                    : "You lost!"}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img
                  src={selectedGame.playerB.avatarUrl}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.webp";
                  }}
                  crossOrigin="use-credentials"
                  alt={selectedGame.playerB.alias}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-text-tertiary"
                />
                <p className="text-sm md:text-base">
                  {selectedGame.playerB.alias}
                </p>
              </div>
            </div>

            {/* Date */}
            <p className="text-sm md:text-base text-gray-400">
              {selectedGame.date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchHistory;
