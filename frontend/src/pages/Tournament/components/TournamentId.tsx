import { useLanguage } from "@/hooks/useLanguage";
import { useNotification } from "@/hooks/useNotification";
import { useTournament } from "@/hooks/useTournament";
import Spinner from "@/layout/Spinner/Spinner";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const TournamentId: React.FC = () => {
  // extract ID from URL
  const { id } = useParams<{ id: string }>();

  // Hooks
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const {
    tournament,
    getTournament,
    getGameDataFromTournament,
    loading,
    error,
  } = useTournament();

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) {
        return;
      }
      await getTournament(id);
    };

    fetchTournament();
  }, [id, getTournament]);

  // handleNextMatch
  const handleRefreshTournament = async () => {
    // If no ID, show error notification
    if (!id) {
      addNotification(t("tournament_refresh_error"), "error");
      return;
    }

    // Get tournament data again
    await getTournament(id);

    addNotification(t("tournament_refresh_success"), "success");
  };

  // handlePlayMatch
  const handlePlayMatch = async (game) => {
    // If no ID, show error notification
    if (!id || !game || !game.id) {
      addNotification(t("tournament_refresh_error"), "error");
      return;
    }

    const refreshTournament = await getTournament(id);

    if (!refreshTournament) {
      addNotification(t("tournament_refresh_error"), "error");
      return;
    }

    const tournamentGameData = await getGameDataFromTournament(id, game.id);

    if (!tournamentGameData) {
      addNotification(t("tournament_refresh_error"), "error");
      return;
    }

    if (sessionStorage.getItem("tournamentGameData")) {
      sessionStorage.removeItem("tournamentGameData");
    }

    // Navigate to the game page with tournament data
    sessionStorage.setItem(
      "tournamentGameData",
      JSON.stringify(tournamentGameData)
    );

    // Redirect to the match page
    // console.log("Tournament game data:", tournamentGameData);
    navigate("/tournament-single-match");
  };

  // loading
  if (loading || !tournament) {
    return (
      <div className="w-full h-44 md:h-90">
        <Spinner />
      </div>
    );
  }

  // error
  if (error) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/tournament")}
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
                {t("tournament_title")} #{tournament.tournament_id}
              </h2>
              <p className="text-text-secondary">
                {t("tournament_players_label")
                  .replace("{current}", String(tournament.players.length))
                  .replace("{max}", String(tournament.players.length))}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefreshTournament}
            className="bg-text-secondary py-2 px-6 rounded-lg font-semibold hover:bg-text-tertiary cursor-pointer transition-all duration-300"
          >
            {t("tournament_refresh")}
          </button>
        </div>
        {/* Tournament Bracket */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
          <div className="overflow-x-auto">
            <div className="flex space-x-10 min-w-max items-center justify-center">
              {tournament.games.map((roundGames, roundIndex: number) => (
                <div
                  key={roundIndex}
                  className="flex flex-col space-y-4 min-w-[400px]"
                >
                  <h3 className="text-text-primary font-bold text-center mb-4">
                    {/* {getRoundName(roundIndex + 1, totalRounds)} */}
                    round {roundIndex + 1}
                  </h3>
                  {roundGames.map((game) => (
                    <div
                      key={game.id}
                      className="bg-background-primary rounded-lg p-4 border border-border-primary"
                    >
                      {/* Player 1 */}
                      <div
                        className={`flex items-center space-x-3 p-3 rounded bg-background-secondary bg-opacity-20`}
                      >
                        {game.player_a_id !== -1 ? (
                          <div className="flex justify-between w-full items-center px-1">
                            <div className="flex items-center space-x-3">
                              <img
                                src={`${
                                  import.meta.env.VITE_USER_API_BASEURL_EXTERNAL
                                }/${game.player_a_id}/avatar`}
                                alt={game.player_a_alias}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.webp";
                                }}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-text-primary font-medium">
                                {game.player_a_alias}
                              </span>
                            </div>
                            <div>{game.player_a_score}</div>
                          </div>
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
                        className={`flex items-center space-x-3 p-3 rounded bg-background-secondary bg-opacity-20`}
                      >
                        {game.player_b_id !== -1 ? (
                          <div className="flex justify-between w-full items-center px-1">
                            <div className="flex items-center space-x-3">
                              <img
                                src={`${
                                  import.meta.env.VITE_USER_API_BASEURL_EXTERNAL
                                }/${game.player_b_id}/avatar`}
                                alt={game.player_b_alias}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.webp";
                                }}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-text-primary font-medium">
                                {game.player_b_alias}
                              </span>
                            </div>
                            <div>{game.player_b_score}</div>
                          </div>
                        ) : (
                          <span className="text-text-secondary italic">
                            {t("tournament_empty_slot")}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handlePlayMatch(game)}
                        disabled={
                          game.player_a_id === -1 ||
                          game.player_b_id === -1 ||
                          game.status === "Finished"
                        }
                        className={`w-full mt-4 bg-text-tertiary text-background-primary py-2 px-4 rounded font-semibold hover:bg-opacity-80 transition-colors ${
                          game.player_a_id === -1 ||
                          game.player_b_id === -1 ||
                          game.status === "Finished"
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-text-secondary transition-all duration-300"
                        }`}
                      >
                        {t("tournament_play")}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentId;
