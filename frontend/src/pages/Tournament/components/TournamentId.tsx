import { useTournament } from "@/hooks/useTournament";
import { useParams } from "react-router";

const TournamentId: React.FC = () => {
  // extract ID from URL
  const { id } = useParams<{ id: string }>();
  const { tournament } = useTournament(id);

  console.log("Tournament data:", tournament);

  return (
    <div>
      <h1>{`Tournament Details: ${id}`}</h1>
    </div>
  );
};

export default TournamentId;
