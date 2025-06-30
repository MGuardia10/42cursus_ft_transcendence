"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router"
import { useFriends } from "@/hooks/useFriends"
import { useNotification } from "@/hooks/useNotification"
import TournamentCodeInput from "@/pages/Tournament/components/TournamentCodeInput"
import { useLanguage } from "@/hooks/useLanguage"

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
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [currentView, setCurrentView] = useState<TournamentView>("main")
  const [selectedPlayers, setSelectedPlayers] = useState<number>(4)
  const [tournamentId, setTournamentId] = useState<string>("")
  const [joinTournamentId, setJoinTournamentId] = useState<string>("")
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [validatedUsers, setValidatedUsers] = useState<Set<number>>(new Set())
  const [participants, setParticipants] = useState<Player[]>([])

  const { friends } = useFriends()
  const { addNotification } = useNotification()

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
              id: Number(user.id),
              alias: user.alias,
              avatar: user.avatar,
            },
          ]
        : [],
      matches,
      status: "waiting",
      createdBy: Number(user?.id) || 0,
    }

    setCurrentTournament(tournament)
    setTournamentId(newTournamentId)
    setLoading(false)
  }

  // Join tournament
  const handleJoinTournament = () => {
    setLoading(true)
    setTimeout(() => {
      const mockTournament: Tournament = {
        id: joinTournamentId,
        maxPlayers: 4,
        currentPlayers: [
          { id: 1, alias: "Player1", avatar: "/placeholder.svg?height=40&width=40" },
          { id: 2, alias: "Player2", avatar: "/placeholder.svg?height=40&width=40" },
          { id: Number(user?.id) || 3, alias: user?.alias || "You", avatar: user?.avatar },
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
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">{t("tournament_title")}</h1>
          <p className="text-text-secondary text-lg">{t("tournament_subtitle")}</p>
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
              <h3 className="text-2xl font-bold text-text-primary mb-4">{t("create_tournament")}</h3>
              <p className="text-text-secondary mb-6">{t("create_tournament_subtitle")}</p>
              <button
                onClick={() => {
                  const creatorId = Number(user?.id) || 0
                  setValidatedUsers(new Set([creatorId]))
                  setParticipants([
                    {
                      id: creatorId,
                      alias: user?.alias || "",
                      avatar: user?.avatar || "",
                    },
                  ])
                  console.log(`📋 Usuarios validados al crear torneo: 1`)
                  console.log(`👤 Creador: ${user?.alias}`)
                  console.log("---")
                  setCurrentView("create")
                }}
                className="w-full bg-text-tertiary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
              >
                {t("create_tournament")}
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
              <h3 className="text-2xl font-bold text-text-primary mb-4">{t("join_tournament")}</h3>
              <p className="text-text-secondary mb-6">{t("join_tournament_subtitle")}</p>
              <button
                onClick={() => setCurrentView("join")}
                className="w-full bg-text-secondary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
              >
                {t("join_tournament")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Componente aislado para invitar y validar código
  const InviteFriendWithCode: React.FC<{
    friend: Player
    user: any
    apiUrl: string
    addNotification: (msg: string, type: "success" | "error") => void
    validatedUsers: Set<number>
    setValidatedUsers: React.Dispatch<React.SetStateAction<Set<number>>>
    isFull: boolean
  }> = ({ friend, user, apiUrl, addNotification, validatedUsers, setValidatedUsers, isFull }) => {
    const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false)
    const [inputVisible, setInputVisible] = useState<boolean>(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [resetKey, setResetKey] = useState(0)

    // Invitar amigo a torneo
    const handleInviteFriend = async () => {
      if (!user) return
      setWaitingForResponse(true)
      setInputVisible(true)
      try {
        const response = await fetch(`${apiUrl}/send-invitation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: friend.id,
          }),
        })
        if (!response.ok) {
          let errorMessage = t("game_invitation_error")
          switch (response.status) {
            case 400:
              errorMessage = t("bad_request_error")
              break
            case 401:
              errorMessage = t("unauthorized_error")
              break
            case 403:
              errorMessage = t("self_invite_error")
              break
            case 404:
              errorMessage = t("user_not_found_error")
              break
            default:
              errorMessage = `Error ${response.status}: ${response.statusText}`
          }
          throw new Error(errorMessage)
        }
        const data = await response.json()
        setVerificationCode(data.hash)
        // Mantener waitingForResponse como true hasta que se valide el código
      } catch (error) {
        addNotification(`${error}`, "error")
        setWaitingForResponse(false)
        setInputVisible(false)
        return
      }
    }

    // Validar código de invitación
    const handleCodeComplete = async (code: string) => {
      if (!verificationCode) {
        addNotification(t("no_hash_error"), "error")
        return
      }
      try {
        const response = await fetch(`${apiUrl}/verify-invitation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            hash: verificationCode,
            code: code,
          }),
        })
        if (!response.ok) {
          let errorMessage = t("tfa_error")
          switch (response.status) {
            case 400:
              errorMessage = t("bad_request_error")
              break
            case 401:
              errorMessage = t("invalid_code_error")
              break
            case 404:
              errorMessage = t("hash_not_found_error")
              break
            case 429:
              errorMessage = t("max_attempts_error")
              setWaitingForResponse(false)
              setVerificationCode("")
              setResetKey((k) => k + 1)
              setInputVisible(false)
              break
            default:
              errorMessage = `Error ${response.status}: ${response.statusText}`
          }
          throw new Error(errorMessage)
        }
        await response.json()
        addNotification(t("tfa_success"), "success")

        // Agregar usuario a la lista de validados
        setValidatedUsers((prev) => {
          const newValidatedUsers = new Set([...prev, friend.id])

          // Añadir a participants si no está
          setParticipants((prevList) => {
            if (!prevList.some((p) => p.id === friend.id)) {
              return [...prevList, friend]
            }
            return prevList
          })

          // Console log con información de usuarios invitados
          console.log(`🎯 Usuario validado: ${friend.alias}`)
          console.log(`📊 Total de usuarios invitados: ${newValidatedUsers.size}`)
          console.log(
            `👥 Usuarios validados:`,
            participants.map((p) => p.alias),
          )
          console.log(`👤 Creador: ${user?.alias}`)
          console.log("---")

          return newValidatedUsers
        })

        setWaitingForResponse(false)
        setVerificationCode("")
        setInputVisible(false)
      } catch (error) {
        addNotification(`${error}`, "error")
      }
    }

    const isValidated = validatedUsers.has(friend.id)

    return (
      <li className="flex flex-col gap-2">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <img
              src={friend.avatar || "/placeholder.svg?height=32&width=32"}
              alt={friend.alias}
              className="w-8 h-8 rounded-full border border-border-primary object-cover"
            />
            <span className="text-text-primary font-medium">{friend.alias}</span>
          </div>
          <button
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              isValidated
                ? "bg-green-500 text-white cursor-not-allowed"
                : waitingForResponse
                  ? "bg-yellow-500 text-white cursor-not-allowed"
                  : isFull
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-text-tertiary text-background-primary hover:bg-opacity-80"
            }`}
            onClick={isValidated || waitingForResponse || isFull ? undefined : handleInviteFriend}
            disabled={isValidated || waitingForResponse || isFull}
          >
            {isValidated ? t("tournament_invited") : waitingForResponse ? t("tournament_pending") : isFull ? t("tournament_full") : t("invite")}
          </button>
        </div>
        {inputVisible && verificationCode && !isValidated && (
          <div className="flex flex-col items-center">
            <div className="w-full -mb-2">
              <TournamentCodeInput length={6} onComplete={handleCodeComplete} resetKey={resetKey} />
            </div>
            <button
              className="w-full bg-[#d35d48] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#b94c39] transition-colors max-w-xs"
              style={{ margin: "0 auto" }}
              onClick={() => {
                setInputVisible(false)
                setVerificationCode("")
                setWaitingForResponse(false)
              }}
            >
              {t("delete_cancel")}
            </button>
          </div>
        )}
      </li>
    )
  }

  // Create tournament view
  const CreateView = () => {
    const { friends } = useFriends()
    const { addNotification } = useNotification()
    const { user } = useAuth()
    const [selectedFriend, setSelectedFriend] = useState<Player | null>(null)
    const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false)
    const [resetKey, setResetKey] = useState(0)
    const [verificationCode, setVerificationCode] = useState("")
    const [inputVisible, setInputVisible] = useState<boolean>(false)
    // @ts-ignore
    // eslint-disable-next-line
    const apiUrl = (import.meta as any).env?.VITE_AUTH_API_BASEURL_EXTERNAL || ""

    // Game Settings del creador
    useEffect(() => {
      const gameSettings = {
        creatorId: user?.id,
        creatorAlias: user?.alias,
        maxPlayers: selectedPlayers,
        friends: friends.map(f => ({ id: f.id, alias: f.alias })),
      };
      console.log("[Game Settings]", gameSettings);
    }, []);

    return (
      <div className="px-4 py-8 flex justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-background-secondary rounded-xl p-8 border border-border-primary">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setCurrentView("main")}
                className="text-text-secondary hover:text-text-primary mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-3xl font-bold text-text-primary">{t("create_tournament")}</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-text-primary font-semibold mb-3">{t("tournament_players")}</label>
                <div className="grid grid-cols-2 gap-4">
                  {[4, 8].map((num) => (
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
                      <div className="text-sm">{t("tournament_players")}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de amigos */}
              <div className="bg-background-primary rounded-lg p-6 border border-border-primary mb-6">
                <h3 className="text-text-primary font-semibold mb-4">{t("home_friends")}</h3>
                <div className="mb-2 text-text-secondary font-mono">
                  {t("tournament_players_label").replace("{current}", String(participants.length)).replace("{max}", String(selectedPlayers))}
                </div>
                {friends.length === 0 ? (
                  <div className="text-text-secondary">{t("tournament_no_friends")}</div>
                ) : (
                  <ul className="space-y-3">
                    {friends.map((friend) => (
                      <InviteFriendWithCode
                        key={friend.id}
                        friend={friend}
                        user={user}
                        apiUrl={apiUrl}
                        addNotification={addNotification}
                        validatedUsers={validatedUsers}
                        setValidatedUsers={setValidatedUsers}
                        isFull={participants.length >= selectedPlayers}
                      />
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    if (!tournamentId) {
                      handleCreateTournament();
                    }
                    setCurrentView("tournament");
                  }}
                  disabled={participants.length < selectedPlayers || loading}
                  className="flex-1 bg-text-tertiary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
                >
                  {t("enter_tournament")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
            <h2 className="text-3xl font-bold text-text-primary">{t("join_tournament")}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-text-primary font-semibold mb-3">{t("tournament_code")}</label>
              <input
                type="text"
                value={joinTournamentId}
                onChange={(e) => setJoinTournamentId(e.target.value.toUpperCase())}
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
              disabled={!!loading || joinTournamentId.length !== 8}
              className="w-full bg-text-secondary text-background-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
            >
              {loading ? t("tournament_joining") : t("join_tournament")}
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
      if (round === totalRounds) return t("tournament_final")
      if (round === totalRounds - 1) return t("tournament_semifinal")
      if (round === totalRounds - 2) return t("tournament_quarterfinal")
      return t("tournament_round").replace("{round}", String(round))
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
                <h2 className="text-3xl font-bold text-text-primary">{t("tournament_title")} #{currentTournament.id}</h2>
                <p className="text-text-secondary">
                  {t("tournament_players_label").replace("{current}", String(participants.length)).replace("{max}", String(currentTournament.maxPlayers))}
                </p>
              </div>
            </div>

            {currentTournament.status === "waiting" && currentTournament.createdBy === Number(user?.id) && (
              <button
                onClick={handleStartTournament}
                disabled={participants.length < currentTournament.maxPlayers}
                className="bg-text-tertiary text-background-primary py-2 px-6 rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
              >
                {t("start_tournament")}
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
                  {currentTournament.status === "waiting" && t("tournament_waiting_for_players")}
                  {currentTournament.status === "active" && t("tournament_active")}
                  {currentTournament.status === "finished" && t("tournament_finished")}
                </span>
              </div>
              <div className="text-text-secondary">
                {t("tournament_code")}: <code className="font-mono">{currentTournament.id}</code>
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
                            <span className="text-text-secondary italic">{t("tournament_empty_slot")}</span>
                          )}
                        </div>

                        <div className="text-center text-text-secondary text-sm py-2">{t("tournament_vs")}</div>

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
                            <span className="text-text-secondary italic">{t("tournament_empty_slot")}</span>
                          )}
                        </div>

                        {/* Play Button */}
                        {match.player1 && match.player2 && !match.winner && currentTournament.status === "active" && (
                          <button
                            onClick={() => handlePlayMatch(match.id)}
                            className="w-full mt-4 bg-text-tertiary text-background-primary py-2 px-4 rounded font-semibold hover:bg-opacity-80 transition-colors"
                          >
                            {t("tournament_play")}
                          </button>
                        )}

                        {match.winner && (
                          <div className="text-center mt-4 text-green-500 font-semibold">
                            {t("tournament_winner").replace("{alias}", match.winner.alias)}
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
            <h3 className="text-text-primary font-bold mb-4">{t("tournament_current_players")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Participants */}
              {participants.map((player) => (
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

              {/* Empty slots */}
              {Array.from({ length: currentTournament.maxPlayers - participants.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center space-x-3 p-3 bg-background-primary rounded-lg border border-border-primary border-dashed"
                >
                  <div className="w-8 h-8 rounded-full bg-background-secondary" />
                  <span className="text-text-secondary italic">{t("tournament_empty_slot")}</span>
                </div>
              ))}
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
