export interface Player {
  id: number;
  alias: string;
  avatar?: string;
}

export interface Match {
  id: string;
  player1?: Player;
  player2?: Player;
  winner?: Player;
  round: number;
  position: number;
}

export interface Tournament {
  id: string;
  maxPlayers: number;
  currentPlayers: Player[];
  matches: Match[];
  status: "waiting" | "active" | "finished";
  createdBy: number;
}

export type TournamentView = "main" | "create" | "join" | "tournament";
