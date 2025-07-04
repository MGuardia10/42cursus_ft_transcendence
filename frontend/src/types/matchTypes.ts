export interface RawMatch {
  id: number;
  status: string;
  date: string;
  player_a_id: number;
  player_a_score: number;
  player_b_id: number;
  player_b_score: number;
}

export interface PlayerInfo {
  id: number;
  active: boolean;
}

export interface UserInfo {
  id: number;
  alias: string;
  avatarUrl: string;
}

export interface EnrichedMatch {
  id: number;
  date: string;
  status: "Won" | "Lost" | "Tie";
  playerA: UserInfo & { score: number };
  playerB: UserInfo & { score: number };
  isPlayerA: boolean;
}
