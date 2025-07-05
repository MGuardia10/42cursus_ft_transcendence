import React from "react";
import type { Player, TournamentView } from "@/types/tournamentTypes";

interface MainViewProps {
  setCurrentView: (view: TournamentView) => void;
  t: (key: any) => string;
  user: any;
  setValidatedUsers: React.Dispatch<React.SetStateAction<Set<number>>>;
  setParticipants: React.Dispatch<React.SetStateAction<Player[]>>;
  selectedPlayers: number;
}

const MainView: React.FC<MainViewProps> = ({
  setCurrentView,
  t,
  user,
  setValidatedUsers,
  setParticipants,
  selectedPlayers,
}) => (
  <div className="flex justify-center px-4 lg:px-16 py-8">
    <div className="w-full max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t("tournament_title")}
        </h1>
        <p className="text-text-secondary text-lg">
          {t("tournament_subtitle")}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Tournament */}
        <div className="bg-background-secondary rounded-xl p-8 border border-border-primary hover:border-text-tertiary transition-colors">
          <div className="text-center">
            <div className="w-16 h-16 bg-text-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-background-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              {t("create_tournament")}
            </h3>
            <p className="text-text-secondary mb-6">
              {t("create_tournament_subtitle")}
            </p>
            <button
              onClick={() => {
                const creatorId = Number(user?.id) || 0;
                setValidatedUsers(new Set([creatorId]));
                setParticipants([
                  {
                    id: creatorId,
                    alias: user?.alias || "",
                    avatar: user?.avatar || "",
                  },
                ]);
                setCurrentView("create");
              }}
              className="w-full bg-text-tertiary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors cursor-pointer"
            >
              {t("create_tournament")}
            </button>
          </div>
        </div>
        {/* Join Tournament */}
        <div className="bg-background-secondary rounded-xl p-8 border border-border-primary hover:border-text-tertiary transition-colors">
          <div className="text-center">
            <div className="w-16 h-16 bg-text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-background-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              {t("join_tournament")}
            </h3>
            <p className="text-text-secondary mb-6">
              {t("join_tournament_subtitle")}
            </p>
            <button
              onClick={() => setCurrentView("join")}
              className="w-full bg-text-secondary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors cursor-pointer"
            >
              {t("join_tournament")}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainView;
