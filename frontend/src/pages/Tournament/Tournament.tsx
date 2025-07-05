import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useFriends } from "@/hooks/useFriends";
import { useNotification } from "@/hooks/useNotification";
import { useLanguage } from "@/hooks/useLanguage";
import type {
  Player,
  Match,
  Tournament,
  TournamentView,
} from "@/types/tournamentTypes";
import { generateBracket } from "./utils/bracket";
import { generateTournamentId } from "./utils/id";
import MainView from "./components/MainView";
import CreateView from "./components/CreateView";
import JoinView from "./components/JoinView";
import TournamentViewComponent from "./components/TournamentView";

const Tournament: React.FC = () => {
  // hooks
  const { user } = useAuth();
  const navigate = useNavigate();
  const { friends } = useFriends();
  const { addNotification } = useNotification();
  const { t } = useLanguage();

  // states
  const [currentView, setCurrentView] = useState<TournamentView>("main");
  const [selectedPlayers, setSelectedPlayers] = useState<number>(4);
  const [tournamentId, setTournamentId] = useState<string>("");
  const [joinTournamentId, setJoinTournamentId] = useState<string>("");
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [validatedUsers, setValidatedUsers] = useState<Set<number>>(new Set());
  const [participants, setParticipants] = useState<Player[]>([]);

  // Create tournament
  const handleCreateTournament = () => {
    setLoading(true);
    const newTournamentId = generateTournamentId();
    const matches = generateBracket(selectedPlayers);

    const tournament: Tournament = {
      id: newTournamentId,
      maxPlayers: selectedPlayers,
      currentPlayers: user
        ? [
            {
              id: Number(user.id),
              alias: user.alias,
              avatar: user.avatar,
            },
          ]
        : [],
      matches,
      status: "waiting",
      createdBy: Number(user?.id) || 0,
    };

    setCurrentTournament(tournament);
    setTournamentId(newTournamentId);
    setLoading(false);
  };

  // Join tournament
  const handleJoinTournament = () => {
    setLoading(true);
    setTimeout(() => {
      const mockTournament: Tournament = {
        id: joinTournamentId,
        maxPlayers: 4,
        currentPlayers: [
          {
            id: 1,
            alias: "Player1",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 2,
            alias: "Player2",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: Number(user?.id) || 3,
            alias: user?.alias || "You",
            avatar: user?.avatar,
          },
        ],
        matches: generateBracket(4),
        status: "waiting",
        createdBy: 1,
      };
      setCurrentTournament(mockTournament);
      setCurrentView("tournament");
      setLoading(false);
    }, 1000);
  };

  // Start tournament
  const handleStartTournament = () => {
    if (currentTournament) {
      const updatedTournament = {
        ...currentTournament,
        status: "active" as const,
      };
      setCurrentTournament(updatedTournament);
    }
  };

  // Play match
  const handlePlayMatch = (matchId: string) => {
    // Crear estructura de datos del torneo
    const tournamentGameData = {
      gameId: parseInt(matchId),
      tournamentId: currentTournament?.id || "unknown",
      player1: {
        id: 1,
        name: "Player 1",
        alias: "player1",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      player2: {
        id: 2,
        name: "Player 2", 
        alias: "player2",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      configuration: {
        default_value: true,
        points_to_win: "5",
        serve_delay: "3",
        ball_color: "FFFFFF",
        stick_color: "FFFFFF",
        field_color: "FFFFFF"
      }
    };

    // Guardar en sessionStorage
    sessionStorage.setItem("tournamentGameData", JSON.stringify(tournamentGameData));
    
    // Navegar a la partida
    navigate("/tournament-single-match");
  };

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
            tournamentId={tournamentId}
            handleCreateTournament={handleCreateTournament}
            loading={loading}
            apiUrl={import.meta.env?.VITE_AUTH_API_BASEURL_EXTERNAL}
          />
        );
      case "join":
        return (
          <JoinView
            setCurrentView={(view: TournamentView) => setCurrentView(view)}
            t={t}
            joinTournamentId={joinTournamentId}
            setJoinTournamentId={setJoinTournamentId}
            handleJoinTournament={handleJoinTournament}
            loading={loading}
          />
        );
      case "tournament":
        return (
          <TournamentViewComponent
            currentTournament={currentTournament}
            setCurrentView={(view: TournamentView) => setCurrentView(view)}
            t={t}
            participants={participants}
            handleStartTournament={handleStartTournament}
            handlePlayMatch={handlePlayMatch}
            user={user}
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
            selectedPlayers={selectedPlayers}
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
