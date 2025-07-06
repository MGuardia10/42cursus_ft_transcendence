import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFriends } from "@/hooks/useFriends";
import { useNotification } from "@/hooks/useNotification";
import { useLanguage } from "@/hooks/useLanguage";
import type {
  Player,
  Tournament,
  TournamentView,
} from "@/types/tournamentTypes";
import MainView from "./components/MainView";
import CreateView from "./components/CreateView";
import JoinView from "./components/JoinView";

const Tournament: React.FC = () => {
  // hooks
  const { user } = useAuth();
  const { friends } = useFriends();
  const { addNotification } = useNotification();
  const { t } = useLanguage();

  // states
  const [currentView, setCurrentView] = useState<TournamentView>("main");
  const [selectedPlayers, setSelectedPlayers] = useState<number>(4);
  const [validatedUsers, setValidatedUsers] = useState<Set<number>>(new Set());
  const [participants, setParticipants] = useState<Player[]>([]);

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
        return (
          <CreateView
            setCurrentView={(view: TournamentView) => setCurrentView(view)}
            t={t}
            user={user}
            friends={friends}
            addNotification={addNotification}
            validatedUsers={validatedUsers}
            setValidatedUsers={setValidatedUsers}
            participants={participants}
            setParticipants={setParticipants}
            selectedPlayers={selectedPlayers}
            setSelectedPlayers={setSelectedPlayers}
            apiUrl={import.meta.env?.VITE_AUTH_API_BASEURL_EXTERNAL}
          />
        );
      case "join":
        return (
          <JoinView
            setCurrentView={(view: TournamentView) => setCurrentView(view)}
            t={t}
          />
        );
      default:
        return (
          <MainView
            setCurrentView={(view: TournamentView) => setCurrentView(view)}
            t={t}
            user={user}
            setValidatedUsers={setValidatedUsers}
            setParticipants={setParticipants}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background-primary w-full">
      {renderCurrentView()}
    </div>
  );
};

export default Tournament;
