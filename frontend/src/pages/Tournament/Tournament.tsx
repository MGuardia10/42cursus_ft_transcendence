"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router"

interface Player {
  id: number
  alias: string
  avatar?: string
}

interface Match {
  id: string
  player1?: Player
  player2?: Player
  winner?: Player
  round: number
  position: number
}

interface Tournament {
  id: string
  maxPlayers: number
  currentPlayers: Player[]
  matches: Match[]
  status: "waiting" | "active" | "finished"
  createdBy: number
}

type TournamentView = "main" | "create" | "join" | "tournament"

const Tournament: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [currentView, setCurrentView] = useState<TournamentView>("main")
  const [selectedPlayers, setSelectedPlayers] = useState<number>(4)
  const [tournamentId, setTournamentId] = useState<string>("")
  const [joinTournamentId, setJoinTournamentId] = useState<string>("")
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(false)

  // Generate tournament ID
  const generateTournamentId = (): string => {
    return Math.random().toString(36).substr(2, 8).toUpperCase()
  }

  // Generate tournament bracket
  const generateBracket = (maxPlayers: number): Match[] => {
    const matches: Match[] = []
    const totalRounds = Math.log2(maxPlayers)

    let matchId = 1
    for (let round = 1; round <= totalRounds; round++) {
      const matchesInRound = maxPlayers / Math.pow(2, round)
      for (let position = 0; position < matchesInRound; position++) {
        matches.push({
          id: `match-${matchId}`,
          round,
          position,
        })
        matchId++
      }
    }

    return matches
  }

  // Create tournament
  const handleCreateTournament = () => {
    setLoading(true)
    const newTournamentId = generateTournamentId()
    const matches = generateBracket(selectedPlayers)

    const tournament: Tournament = {
      id: newTournamentId,
      maxPlayers: selectedPlayers,
      currentPlayers: user
        ? [
            {
              id: user.id,
              alias: user.alias,
              avatar: user.avatar,
            },
          ]
        : [],
      matches,
      status: "waiting",
      createdBy: user?.id || 0,
    }

    setCurrentTournament(tournament)
    setTournamentId(newTournamentId)
    setLoading(false)
  }

  // Join tournament
  const handleJoinTournament = () => {
    setLoading(true)
    // Simulate joining tournament - in real app this would be an API call
    setTimeout(() => {
      // Mock tournament data
      const mockTournament: Tournament = {
        id: joinTournamentId,
        maxPlayers: 4,
        currentPlayers: [
          { id: 1, alias: "Player1", avatar: "/placeholder.svg?height=40&width=40" },
          { id: 2, alias: "Player2", avatar: "/placeholder.svg?height=40&width=40" },
          { id: user?.id || 3, alias: user?.alias || "You", avatar: user?.avatar },
        ],
        matches: generateBracket(4),
        status: "waiting",
        createdBy: 1,
      }

      setCurrentTournament(mockTournament)
      setCurrentView("tournament")
      setLoading(false)
    }, 1000)
  }

  // Start tournament
  const handleStartTournament = () => {
    if (currentTournament) {
      const updatedTournament = { ...currentTournament, status: "active" as const }
      setCurrentTournament(updatedTournament)
    }
  }

  // Play match
  const handlePlayMatch = (matchId: string) => {
    navigate("/single-match", { state: { tournamentMatch: matchId } })
  }

  // Main tournament selection view
  const MainView = () => (
    <div className="flex justify-center px-4 lg:px-16 py-8">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {t("tournament") || "Tournament"}
          </h1>
          <p className="text-text-secondary text-lg">
            {t("tournament_description") || "Create or join a tournament to compete with other players"}
          </p>
        </div>
  
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Tournament */}
          <div className="bg-background-secondary rounded-xl p-8 border border-border-primary hover:border-text-tertiary transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-text-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                {t("create_tournament") || "Create Tournament"}
              </h3>
              <p className="text-text-secondary mb-6">
                {t("create_tournament_desc") || "Start a new tournament and invite players to join"}
              </p>
              <button
                onClick={() => setCurrentView("create")}
                className="w-full bg-text-tertiary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
              >
                {t("create") || "Create"}
              </button>
            </div>
          </div>
  
          {/* Join Tournament */}
          <div className="bg-background-secondary rounded-xl p-8 border border-border-primary hover:border-text-tertiary transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                {t("join_tournament") || "Join Tournament"}
              </h3>
              <p className="text-text-secondary mb-6">
                {t("join_tournament_desc") || "Enter a tournament code to join an existing tournament"}
              </p>
              <button
                onClick={() => setCurrentView("join")}
                className="w-full bg-text-secondary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
              >
                {t("join") || "Join"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  

// Create tournament view
const CreateView = () => (
  <div className="px-4 py-8 flex justify-center">
    <div className="max-w-2xl w-full">
      <div className="bg-background-secondary rounded-xl p-8 border border-border-primary">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentView("main")}
            className="text-text-secondary hover:text-text-primary mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-text-primary">
            {t("create_tournament") || "Create Tournament"}
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-text-primary font-semibold mb-3">
              {t("number_of_players") || "Number of Players"}
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[2, 4, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedPlayers(num)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedPlayers === num
                      ? "border-text-tertiary text-text-secondary bg-opacity-10 text-text-tertiary"
                      : "border-border-secondary text-text-secondary hover:border-text-secondary"
                  }`}
                >
                  <div className="text-2xl font-bold">{num}</div>
                  <div className="text-sm">{t("players") || "Players"}</div>
                </button>
              ))}
            </div>
          </div>

          {tournamentId && (
            <div className="bg-background-primary rounded-lg p-6 border border-border-primary">
              <h3 className="text-text-primary font-semibold mb-2">
                {t("tournament_id") || "Tournament ID"}
              </h3>
              <div className="flex items-center space-x-4">
                <code className="bg-background-secondary px-4 py-2 rounded text-text-tertiary font-mono text-lg flex-1">
                  {tournamentId}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(tournamentId)}
                  className="text-text-secondary hover:text-text-primary"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-text-secondary text-sm mt-2">
                {t("share_tournament_id") ||
                  "Share this ID with other players so they can join your tournament"}
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            {!tournamentId ? (
              <button
                onClick={handleCreateTournament}
                disabled={loading}
                className="flex-1 bg-text-tertiary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
              >
                {loading ? t("creating") || "Creating..." : t("create_tournament") || "Create Tournament"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentView("tournament")}
                className="flex-1 bg-text-tertiary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
              >
                {t("enter_tournament") || "Enter Tournament"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);


  // Join tournament view
  const JoinView = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-background-secondary rounded-xl p-8 border border-border-primary">
          <div className="flex items-center mb-6">
            <button onClick={() => setCurrentView("main")} className="text-text-secondary hover:text-text-primary mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold text-text-primary">{t("join_tournament") || "Join Tournament"}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-text-primary font-semibold mb-3">
                {t("tournament_code") || "Tournament Code"}
              </label>
              <input
                type="text"
                value={joinTournamentId}
                onChange={(e) => setJoinTournamentId(e.target.value.toUpperCase())}
                placeholder={t("enter_tournament_code") || "Enter tournament code"}
                className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-text-tertiary font-mono text-lg tracking-wider"
                maxLength={8}
              />
              <p className="text-text-secondary text-sm mt-2">
                {t("tournament_code_desc") || "Enter the 8-character code provided by the tournament creator"}
              </p>
            </div>

            <button
              onClick={handleJoinTournament}
              disabled={loading || joinTournamentId.length !== 8}
              className="w-full bg-text-secondary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
            >
              {loading ? t("joining") || "Joining..." : t("join_tournament") || "Join Tournament"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Tournament bracket view
  const TournamentView = () => {
    if (!currentTournament) return null

    const getRoundName = (round: number, totalRounds: number) => {
      if (round === totalRounds) return t("final") || "Final"
      if (round === totalRounds - 1) return t("semifinal") || "Semifinal"
      if (round === totalRounds - 2) return t("quarterfinal") || "Quarterfinal"
      return `${t("round") || "Round"} ${round}`
    }

    const totalRounds = Math.log2(currentTournament.maxPlayers)
    const rounds: Match[][] = []

    for (let round = 1; round <= totalRounds; round++) {
      rounds.push(currentTournament.matches.filter((match) => match.round === round))
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentView("main")}
                className="text-text-secondary hover:text-text-primary mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h2 className="text-3xl font-bold text-text-primary">
                  {t("tournament") || "Tournament"} #{currentTournament.id}
                </h2>
                <p className="text-text-secondary">
                  {currentTournament.currentPlayers.length}/{currentTournament.maxPlayers} {t("players") || "players"}
                </p>
              </div>
            </div>

            {currentTournament.status === "waiting" && currentTournament.createdBy === user?.id && (
              <button
                onClick={handleStartTournament}
                disabled={currentTournament.currentPlayers.length < currentTournament.maxPlayers}
                className="bg-text-tertiary text-background-primary py-2 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
              >
                {t("start_tournament") || "Start Tournament"}
              </button>
            )}
          </div>

          {/* Tournament Status */}
          <div className="bg-background-secondary rounded-lg p-4 mb-8 border border-border-primary">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentTournament.status === "waiting"
                      ? "bg-yellow-500"
                      : currentTournament.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                  }`}
                />
                <span className="text-text-primary font-semibold">
                  {currentTournament.status === "waiting" && (t("waiting_for_players") || "Waiting for players")}
                  {currentTournament.status === "active" && (t("tournament_active") || "Tournament Active")}
                  {currentTournament.status === "finished" && (t("tournament_finished") || "Tournament Finished")}
                </span>
              </div>
              <div className="text-text-secondary">
                {t("tournament_id") || "Tournament ID"}: <code className="font-mono">{currentTournament.id}</code>
              </div>
            </div>
          </div>

          {/* Tournament Bracket */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
            <div className="overflow-x-auto">
              <div className="flex space-x-8 min-w-max">
                {rounds.map((roundMatches, roundIndex) => (
                  <div key={roundIndex} className="flex flex-col space-y-4 min-w-[300px]">
                    <h3 className="text-text-primary font-bold text-center mb-4">
                      {getRoundName(roundIndex + 1, totalRounds)}
                    </h3>
                    {roundMatches.map((match) => (
                      <div key={match.id} className="bg-background-primary rounded-lg p-4 border border-border-primary">
                        {/* Player 1 */}
                        <div
                          className={`flex items-center space-x-3 p-3 rounded ${
                            match.winner?.id === match.player1?.id ? "bg-background-secondary bg-opacity-20" : ""
                          }`}
                        >
                          {match.player1 ? (
                            <>
                              <img
                                src={match.player1.avatar || "/placeholder.svg?height=32&width=32"}
                                alt={match.player1.alias}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-text-primary font-medium">{match.player1.alias}</span>
                            </>
                          ) : (
                            <span className="text-text-secondary italic">
                              {t("waiting_for_player") || "Waiting for player..."}
                            </span>
                          )}
                        </div>

                        <div className="text-center text-text-secondary text-sm py-2">VS</div>

                        {/* Player 2 */}
                        <div
                          className={`flex items-center space-x-3 p-3 rounded ${
                            match.winner?.id === match.player2?.id ? "bg-background-secondary bg-opacity-20" : ""
                          }`}
                        >
                          {match.player2 ? (
                            <>
                              <img
                                src={match.player2.avatar || "/placeholder.svg?height=32&width=32"}
                                alt={match.player2.alias}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-text-primary font-medium">{match.player2.alias}</span>
                            </>
                          ) : (
                            <span className="text-text-secondary italic">
                              {t("waiting_for_player") || "Waiting for player..."}
                            </span>
                          )}
                        </div>

                        {/* Play Button */}
                        {match.player1 && match.player2 && !match.winner && currentTournament.status === "active" && (
                          <button
                            onClick={() => handlePlayMatch(match.id)}
                            className="w-full mt-4 bg-text-tertiary text-background-primary py-2 px-4 rounded font-semibold hover:bg-opacity-80 transition-colors"
                          >
                            {t("play") || "Play"}
                          </button>
                        )}

                        {match.winner && (
                          <div className="text-center mt-4 text-green-500 font-semibold">
                            {t("winner") || "Winner"}: {match.winner.alias}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Players */}
          <div className="mt-8 bg-background-secondary rounded-xl p-6 border border-border-primary">
            <h3 className="text-text-primary font-bold mb-4">{t("current_players") || "Current Players"}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentTournament.currentPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center space-x-3 p-3 bg-background-primary rounded-lg border border-border-primary"
                >
                  <img
                    src={player.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={player.alias}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-text-primary font-medium">{player.alias}</span>
                </div>
              ))}
              {Array.from({ length: currentTournament.maxPlayers - currentTournament.currentPlayers.length }).map(
                (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="flex items-center space-x-3 p-3 bg-background-primary rounded-lg border border-border-primary border-dashed"
                  >
                    <div className="w-8 h-8 rounded-full bg-background-secondary" />
                    <span className="text-text-secondary italic">{t("waiting") || "Waiting..."}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
        return <CreateView />
      case "join":
        return <JoinView />
      case "tournament":
        return <TournamentView />
      default:
        return <MainView />
    }
  }

  return <div className="min-h-screen bg-background-primary">{renderCurrentView()}</div>
}

export default Tournament
