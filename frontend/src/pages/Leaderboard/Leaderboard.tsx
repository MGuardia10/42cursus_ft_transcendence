import { useLanguage } from "@/hooks/useLanguage";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import Spinner from "@/layout/Spinner/Spinner";

const Leaderboard: React.FC = () => {
  // useLanguage hook
  const { t } = useLanguage();

  // useLeaderboard hook
  const {
    topPlayers,
    currentPlayers,
    loadingTop,
    loadingPage,
    errorTop,
    errorPage,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useLeaderboard();

  // If loading
  // if (loadingTop || loadingPage) return <Spinner />;

  // If error
  if (errorTop || errorPage) {
    return (
      <div className="h-72 w-full rounded-md mx-auto p-6 md:p-10 bg-background-secondary">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">
          {t("leaderboard_error_fetching")}
        </h2>
        <p className="text-text-secondary">
          {errorTop?.message || errorPage?.message || "HOLA"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md mx-auto p-6 md:p-10 bg-background-secondary">
      {/* Top 3 Podio */}
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">
          {t("leaderboard_top_3")}
        </h2>

        {loadingTop ? (
          <div className="min-h-[200px] flex items-center py-8">
            <Spinner />
          </div>
        ) : topPlayers.length !== 0 ? (
          <div className="min-h-[200px] flex justify-center items-end gap-4 md:gap-8 lg:gap-10">
            {/* Segundo puesto (izquierda) */}
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-300 mb-2">2</span>
              <img
                src={`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                  topPlayers[1] ? topPlayers[1].id : "0"
                }/avatar`}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.webp";
                }}
                crossOrigin="use-credentials"
                alt={topPlayers[1] ? topPlayers[1].alias : "No data"}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full mb-2 border-2 border-gray-300"
              />
              <span className="font-bold">
                {topPlayers[1] ? topPlayers[1].alias : "No data"}
              </span>
              <span className="text-xs md:text-sm">
                {topPlayers[1] ? topPlayers[1].win_percentage : "0"}%{" "}
                {t("leaderboard_wins")}
              </span>
            </div>
            {/* Primer puesto (centro) */}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-500 mb-2">1</span>
              <img
                src={`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                  topPlayers[0] ? topPlayers[0].id : "0"
                }/avatar`}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.webp";
                }}
                crossOrigin="use-credentials"
                alt={topPlayers[0] ? topPlayers[0].alias : "No data"}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-2 border-2 border-yellow-500"
              />
              <span className="font-bold">
                {topPlayers[0] ? topPlayers[0].alias : "No data"}
              </span>
              <span className="text-xs md:text-sm">
                {topPlayers[0] ? topPlayers[0].win_percentage : "0"}%{" "}
                {t("leaderboard_wins")}
              </span>
            </div>
            {/* Tercer puesto (derecha) */}
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-orange-800 mb-2">3</span>
              <img
                src={`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                  topPlayers[2] ? topPlayers[2].id : "0"
                }/avatar`}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.webp";
                }}
                crossOrigin="use-credentials"
                alt={topPlayers[2] ? topPlayers[2].alias : "No data"}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full mb-2 border-2 border-orange-800"
              />
              <span className="font-bold">
                {topPlayers[2] ? topPlayers[2].alias : "No data"}
              </span>
              <span className="text-xs md:text-sm">
                {topPlayers[2] ? topPlayers[2].win_percentage : "0"}%{" "}
                {t("leaderboard_wins")}
              </span>
            </div>
          </div>
        ) : (
          <div className="min-h-[200px] flex items-center justify-center">
            <p className="text-text-secondary">{t("leaderboard_no_data")}</p>
          </div>
        )}
      </div>

      {/* Ranking con paginación */}
      <div>
        <h2 className="text-lg md:text-2xl font-semibold mb-4">
          {t("leaderboard_ranking")}
        </h2>

        <div className="min-h-[375px]">
          {loadingPage ? (
            <div className="min-h-[375px] flex items-center h-full">
              <Spinner />
            </div>
          ) : currentPlayers.length !== 0 ? (
            <ul className="flex flex-col gap-3">
              {currentPlayers.map((player) => (
                <li
                  key={player.id}
                  className="flex flex-row items-center justify-between gap-4 p-3 bg-background-primary rounded-md hover:cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-text-tertiary">
                      {player.position}
                    </span>
                    <img
                      src={`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                        player.id
                      }/avatar`}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.webp";
                      }}
                      crossOrigin="use-credentials"
                      alt={player.alias}
                      className="w-10 h-10 rounded-full border-2 border-text-tertiary"
                    />
                    <span className="font-bold">{player.alias}</span>
                  </div>
                  <div>
                    <p className="font-bold text-text-tertiary">
                      {player.win_percentage}% {t("leaderboard_wins")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="min-h-[375px] flex items-center justify-center">
              <p className="text-text-secondary">{t("leaderboard_no_data")}</p>
            </div>
          )}
        </div>

        {/* Controles de paginación */}
        <div className="mt-5 md:mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center p-2 md:py-2 md:px-3 bg-text-secondary rounded-xs disabled:opacity-50 disabled:cursor-default disabled:hover:bg-text-tertiary hover:cursor-pointer hover:bg-text-tertiary transition-all duration-300"
          >
            <IoMdArrowRoundBack className="inline-block" />
          </button>
          <span>
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center p-2 md:py-2 md:px-3 bg-text-secondary rounded-xs disabled:opacity-50 disabled:cursor-default disabled:hover:bg-text-tertiary hover:cursor-pointer hover:bg-text-tertiary transition-all duration-300"
          >
            <IoMdArrowRoundBack className="inline-block rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
