/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { TournamentView } from "@/types/tournamentTypes";
import { useAuth } from "@/hooks/useAuth";
import { useTournament } from "@/hooks/useTournament";
import { useNotification } from "@/hooks/useNotification";
import { useNavigate } from "react-router";

interface JoinViewProps {
  setCurrentView: (view: TournamentView) => void;
  t: (key: any) => string;
}

const JoinView: React.FC<JoinViewProps> = ({ setCurrentView, t }) => {
  // hooks
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const { joinTournament } = useTournament();

  // useState variables
  const [tournamentId, setTournamentId] = useState<string>("");

  // Function to handle joining the tournament
  const handleJoinTournament = async () => {
    if (tournamentId.length !== 8) {
      alert(t("tournament_invalid_code"));
      return;
    }

    const joinData = await joinTournament(tournamentId, user?.id || "0");

    console.log("Join data:", joinData);

    if (!joinData) {
      addNotification(t("tournament_join_error"), "error");
      return;
    }

    addNotification(t("tournament_join_success"), "success");
    navigate(`/tournament/${joinData.tournament_id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-background-secondary rounded-xl p-8 border border-border-primary">
          <div className="flex items-center mb-6">
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
            <h2 className="text-3xl font-bold text-text-primary">
              {t("join_tournament")}
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-text-primary font-semibold mb-3">
                {t("tournament_code")}
              </label>
              <input
                type="text"
                value={tournamentId}
                onChange={(e) => setTournamentId(e.target.value.toUpperCase())}
                placeholder={t("enter_tournament_code")}
                className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-text-tertiary font-mono text-lg tracking-wider"
                maxLength={8}
              />
              <p className="text-text-secondary text-sm mt-2">
                {t("tournament_enter_code_hint")}
              </p>
            </div>
            <button
              onClick={handleJoinTournament}
              disabled={tournamentId.length !== 8}
              className="cursor-pointer w-full bg-text-secondary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
            >
              {t("join_tournament")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinView;
