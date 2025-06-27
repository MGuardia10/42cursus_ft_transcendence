"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useLanguage } from "../../hooks/useLanguage"
import { useGameSettings } from "@/hooks/useGameSettings"
import { useGame } from "@/hooks/useGame"
import { usePlayer } from "@/hooks/usePlayer"
import { useNotification } from "@/hooks/useNotification"
import { useAuth } from "@/hooks/useAuth"

interface PlayerData {
  id: string
  name: string
  alias: string
  avatar?: string
}

interface GameData {
  player1: PlayerData
  player2: PlayerData
}

interface GameState {
  ball: {
    x: number
    y: number
    dx: number
    dy: number
  }
  playerPaddle: {
    y: number
  }
  enemyPaddle: {
    y: number
    direction: number
  }
  gameScore: {
    player: number
    enemy: number
  }
  gamePaused: boolean
  gameWidth: number
  gameHeight: number
}

const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 12
const BALL_SIZE = 12
const PADDLE_SPEED = 3
const BALL_SPEED = 2

const SingleMatch: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { addNotification } = useNotification()

  // 🔥 Usar los hooks correctamente
  const { createGame, updateGame, loading: gameLoading, error: gameError } = useGame()
  const { refreshPlayerStats } = usePlayer()

  // Get player game settings
  const { ballColor, bgColor, barColor, serveDelay, score, defaultValue, loading: settingsLoading } = useGameSettings()

  const gameRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const keysRef = useRef<{ [key: string]: boolean }>({})

  // Load player data from sessionStorage
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [gameEnded, setGameEnded] = useState(false)
  const [backendGameId, setBackendGameId] = useState<number | null>(null)
  const [gameCreated, setGameCreated] = useState(false)
  const [gameUpdated, setGameUpdated] = useState(false)

  const updateGameCalledRef = useRef(false)
  const endGameHandledRef = useRef(false)

  useEffect(() => {
    const storedGameData = sessionStorage.getItem("gameData")
    if (storedGameData) {
      try {
        const parsedData = JSON.parse(storedGameData)
        setGameData(parsedData)
      } catch (error) {
        console.error("Error parsing game data:", error)
        addNotification("Error loading game data", "error")
      }
    }
  }, [addNotification])

  const [gameState, setGameState] = useState<GameState>({
    ball: { x: 400, y: 300, dx: BALL_SPEED, dy: BALL_SPEED },
    playerPaddle: { y: 260 },
    enemyPaddle: { y: 260, direction: 1 },
    gameScore: { player: 0, enemy: 0 },
    gamePaused: false,
    gameWidth: 800,
    gameHeight: 600,
  })

  // Clear game data when game ends
  useEffect(() => {
    if (gameEnded) {
      sessionStorage.removeItem("gameData")
    }
  }, [gameEnded])

  // Use player's custom game settings only if custom settings are enabled and not loading
  const finalServeDelay =
    settingsLoading || defaultValue ? Number.parseInt(import.meta.env.VITE_SERVE_DELAY) : serveDelay
  const finalPointsToWin = settingsLoading || defaultValue ? Number.parseInt(import.meta.env.VITE_POINTS_TO_WIN) : score

  // 🔥 Función para crear una partida usando el hook
  const createBackendGame = useCallback(async () => {
    if (!gameData || !user || gameCreated) return

    try {
      const result = await createGame({
        player_a_id: gameData.player1.id,
        player_b_id: gameData.player2.id,
      })

      if (result) {
        setBackendGameId(result.game_id)
        console.log("✅ Game created with ID:", result.game_id) // <--- AÑADIDO
        setGameCreated(true)
        setGameUpdated(false)
      } else {
        addNotification("Error creating game in backend", "error")
      }
    } catch (error) {
      console.error("Error creating backend game:", error)
      addNotification("Error creating game in backend", "error")
    }
  }, [gameData, user, gameCreated, createGame, addNotification])

  const updateBackendGame = useCallback(
    async (playerScore: number, enemyScore: number) => {
      if (!backendGameId || gameUpdated || updateGameCalledRef.current) {
        return
      }
      updateGameCalledRef.current = true
      try {
        setGameUpdated(true)
        console.log("[SingleMatch] Llamando a updateBackendGame", { backendGameId, playerScore, enemyScore })
        const success = await updateGame(backendGameId, {
          player_a_score: playerScore,
          player_b_score: enemyScore,
          state: "Finished",
        })
        if (success) {
          // 👉 Logs informativos
          console.log("✅ Game ID:", backendGameId)
          console.log("🎯 Final Score - Player A:", playerScore, "| Player B:", enemyScore)
          if (gameData) {
            const winner = playerScore > enemyScore ? gameData.player1 : gameData.player2
            console.log("🏆 Winner ID:", winner.id)
            console.log("🏆 Winner Name:", winner.alias)
          }
          // Refresh player stats after game completion
          await refreshPlayerStats()
          addNotification("Game completed and stats updated!", "success")
        } else {
          setGameUpdated(false)
          updateGameCalledRef.current = false
          addNotification("Error updating game result", "error")
        }
      } catch (error) {
        console.error("Error updating backend game:", error)
        addNotification("Error updating game result", "error")
        setGameUpdated(false)
        updateGameCalledRef.current = false
      }
    },
    [backendGameId, gameUpdated, updateGame, refreshPlayerStats, addNotification, gameData],
  )

  const updateGameDimensions = useCallback(() => {
    if (gameRef.current) {
      const rect = gameRef.current.getBoundingClientRect()
      const width = Math.min(rect.width, 800)
      const height = Math.min(rect.height, 600)
      setGameState((prev: GameState) => ({
        ...prev,
        gameWidth: width,
        gameHeight: height,
        ball: {
          ...prev.ball,
          x: prev.ball.x * (width / prev.gameWidth),
          y: prev.ball.y * (height / prev.gameHeight),
        },
        playerPaddle: {
          y: prev.playerPaddle.y * (height / prev.gameHeight),
        },
        enemyPaddle: {
          ...prev.enemyPaddle,
          y: prev.enemyPaddle.y * (height / prev.gameHeight),
        },
      }))
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("resize", updateGameDimensions)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("resize", updateGameDimensions)
    }
  }, [updateGameDimensions])

  useEffect(() => {
    updateGameDimensions()
  }, [updateGameDimensions])

  const resetBall = useCallback(
    (gameWidth: number, gameHeight: number, withDelay = true) => {
      const newBall = {
        x: gameWidth / 2,
        y: gameHeight / 2,
        dx: 0,
        dy: 0,
      }
      if (withDelay) {
        setTimeout(() => {
          setGameState((prev: GameState) => ({
            ...prev,
            ball: {
              ...prev.ball,
              dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
              dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
            },
          }))
        }, finalServeDelay * 1000)
      } else {
        newBall.dx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED
        newBall.dy = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED
      }
      return newBall
    },
    [finalServeDelay],
  )

  const gameLoop = useCallback(() => {
    setGameState((prev: GameState) => {
      if (!prev.gamePaused || gameEnded) return prev

      const newState = { ...prev }
      const { gameWidth, gameHeight } = newState

      // Jugador 1: solo W y S
      if (keysRef.current["w"] || keysRef.current["W"]) {
        newState.playerPaddle.y = Math.max(0, newState.playerPaddle.y - PADDLE_SPEED)
      }
      if (keysRef.current["s"] || keysRef.current["S"]) {
        newState.playerPaddle.y = Math.min(gameHeight - PADDLE_HEIGHT, newState.playerPaddle.y + PADDLE_SPEED)
      }

      // Jugador 2: teclas O y L
      if (keysRef.current["o"] || keysRef.current["O"]) {
        newState.enemyPaddle.y = Math.max(0, newState.enemyPaddle.y - PADDLE_SPEED)
      }
      if (keysRef.current["l"] || keysRef.current["L"]) {
        newState.enemyPaddle.y = Math.min(gameHeight - PADDLE_HEIGHT, newState.enemyPaddle.y + PADDLE_SPEED)
      }

      newState.ball.x += newState.ball.dx
      newState.ball.y += newState.ball.dy

      if (newState.ball.y <= 0 || newState.ball.y >= gameHeight - BALL_SIZE) {
        newState.ball.dy *= -1
      }

      if (
        newState.ball.x <= PADDLE_WIDTH &&
        newState.ball.y >= newState.playerPaddle.y &&
        newState.ball.y <= newState.playerPaddle.y + PADDLE_HEIGHT &&
        newState.ball.dx < 0
      ) {
        newState.ball.dx *= -1
        const hitPos = (newState.ball.y - newState.playerPaddle.y) / PADDLE_HEIGHT
        newState.ball.dy = (hitPos - 0.5) * BALL_SPEED * 2
      }

      if (
        newState.ball.x >= gameWidth - PADDLE_WIDTH - BALL_SIZE &&
        newState.ball.y >= newState.enemyPaddle.y &&
        newState.ball.y <= newState.enemyPaddle.y + PADDLE_HEIGHT &&
        newState.ball.dx > 0
      ) {
        newState.ball.dx *= -1
        const hitPos = (newState.ball.y - newState.enemyPaddle.y) / PADDLE_HEIGHT
        newState.ball.dy = (hitPos - 0.5) * BALL_SPEED * 2
      }

      if (newState.ball.x < -BALL_SIZE) {
        newState.gameScore.enemy++
        newState.ball = {
          x: gameWidth / 2,
          y: gameHeight / 2,
          dx: 0,
          dy: 0,
        }

        setTimeout(() => {
          setGameState((prev: GameState) => ({
            ...prev,
            ball: {
              ...prev.ball,
              dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
              dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
            },
          }))
        }, finalServeDelay * 1000)

        if (newState.gameScore.enemy >= finalPointsToWin) {
          if (!endGameHandledRef.current) {
            endGameHandledRef.current = true
            newState.gamePaused = false
            setGameEnded(true)
            updateBackendGame(newState.gameScore.player, newState.gameScore.enemy)
          }
        }
      } else if (newState.ball.x > gameWidth + BALL_SIZE) {
        newState.gameScore.player++
        newState.ball = {
          x: gameWidth / 2,
          y: gameHeight / 2,
          dx: 0,
          dy: 0,
        }

        setTimeout(() => {
          setGameState((prev: GameState) => ({
            ...prev,
            ball: {
              ...prev.ball,
              dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
              dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
            },
          }))
        }, finalServeDelay * 1000)

        if (newState.gameScore.player >= finalPointsToWin) {
          if (!endGameHandledRef.current) {
            endGameHandledRef.current = true
            newState.gamePaused = false
            setGameEnded(true)
            updateBackendGame(newState.gameScore.player, newState.gameScore.enemy)
          }
        }
      }

      return newState
    })

    if (!gameEnded) {
      animationRef.current = requestAnimationFrame(gameLoop)
    }
  }, [resetBall, finalServeDelay, finalPointsToWin, updateBackendGame, gameEnded, gameUpdated])

  const pauseGame = () => {
    setGameState((prev: GameState) => ({
      ...prev,
      gamePaused: !prev.gamePaused,
    }))
  }

  const startGame = async () => {
    if (!gameCreated) {
      await createBackendGame()
    }

    setGameState((prev: GameState) => ({
      ...prev,
      gamePaused: true,
    }))
  }

  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    endGameHandledRef.current = false
    setGameState((prev: GameState) => ({
      ...prev,
      ball: resetBall(prev.gameWidth, prev.gameHeight, false),
      playerPaddle: { y: prev.gameHeight / 2 - PADDLE_HEIGHT / 2 },
      enemyPaddle: { y: prev.gameHeight / 2 - PADDLE_HEIGHT / 2, direction: 1 },
      gameScore: { player: 0, enemy: 0 },
      gamePaused: false,
    }))

    setGameEnded(false)
    setBackendGameId(null)
    setGameCreated(false)
    setGameUpdated(false)
  }

  useEffect(() => {
    if (gameState.gamePaused && !gameEnded) {
      animationRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameState.gamePaused, gameLoop, gameEnded])

  // Use player's custom ball color only if custom settings are enabled and not loading
  const finalBallColor = settingsLoading || defaultValue ? `#${import.meta.env.VITE_BALL_COLOR}` : ballColor
  const finalBgColor = settingsLoading || defaultValue ? `#${import.meta.env.VITE_FIELD_COLOR}` : bgColor
  const finalBarColor = settingsLoading || defaultValue ? `#${import.meta.env.VITE_STICK_COLOR}` : barColor

  // Show loading if game settings are loading
  if (settingsLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-text-tertiary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading game settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-background-primary">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{t?.singleMatch || "Single Match"}</h1>
          <p className="text-text-secondary">{t("single_match_play")}</p>
          {backendGameId && <p className="text-sm text-text-tertiary mt-2">Game ID: {backendGameId}</p>}
        </div>

        <div className="flex justify-center items-center mb-6 bg-background-secondary rounded-lg p-4">
          <div className="text-center mx-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              {gameData?.player1.avatar && (
                <img
                  src={gameData.player1.avatar || "/placeholder.svg"}
                  alt={gameData.player1.alias}
                  className="w-8 h-8 rounded-full border border-text-tertiary object-cover"
                />
              )}
              <div className="text-text-secondary text-sm">{gameData?.player1.alias || "Jugador 1"}</div>
            </div>
            <div className="text-3xl font-bold text-text-tertiary">{gameState.gameScore.player}</div>
          </div>
          <div className="text-2xl text-text-primary mx-4">-</div>
          <div className="text-center mx-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              {gameData?.player2.avatar && (
                <img
                  src={gameData.player2.avatar || "/placeholder.svg"}
                  alt={gameData.player2.alias}
                  className="w-8 h-8 rounded-full border border-text-tertiary object-cover"
                />
              )}
              <div className="text-text-secondary text-sm">{gameData?.player2.alias || "Jugador 2"}</div>
            </div>
            <div className="text-3xl font-bold text-text-tertiary">{gameState.gameScore.enemy}</div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div
            ref={gameRef}
            className="relative rounded-lg overflow-hidden"
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              aspectRatio: "4/3",
              backgroundColor: finalBgColor,
              border: `1px solid ${finalBarColor}`,
            }}
          >
            <div
              className="absolute opacity-50"
              style={{
                left: "50%",
                top: 0,
                width: "2px",
                height: "100%",
                transform: "translateX(-50%)",
                backgroundColor: finalBarColor,
              }}
            />
            <div
              className="absolute rounded-sm"
              style={{
                left: 0,
                top: `${(gameState.playerPaddle.y / gameState.gameHeight) * 100}%`,
                width: `${(PADDLE_WIDTH / gameState.gameWidth) * 100}%`,
                height: `${(PADDLE_HEIGHT / gameState.gameHeight) * 100}%`,
                backgroundColor: finalBarColor,
              }}
            />
            <div
              className="absolute rounded-sm"
              style={{
                right: 0,
                top: `${(gameState.enemyPaddle.y / gameState.gameHeight) * 100}%`,
                width: `${(PADDLE_WIDTH / gameState.gameWidth) * 100}%`,
                height: `${(PADDLE_HEIGHT / gameState.gameHeight) * 100}%`,
                backgroundColor: finalBarColor,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                left: `${(gameState.ball.x / gameState.gameWidth) * 100}%`,
                top: `${(gameState.ball.y / gameState.gameHeight) * 100}%`,
                width: `${(BALL_SIZE / gameState.gameWidth) * 100}%`,
                height: `${(BALL_SIZE / gameState.gameHeight) * 100}%`,
                backgroundColor: finalBallColor,
              }}
            />
            {!gameState.gamePaused && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-2xl text-text-primary">
                  {gameState.gameScore.player === 0 && gameState.gameScore.enemy === 0
                    ? t?.pressToStart || "Press Start to Play"
                    : gameState.gameScore.player >= finalPointsToWin
                      ? `¡${gameData?.player1.alias || "Jugador 1"} gana!`
                      : gameState.gameScore.enemy >= finalPointsToWin
                        ? `¡${gameData?.player2.alias || "Jugador 2"} gana!`
                        : t?.gamePaused || "Game Paused"}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            {gameState.gameScore.player < finalPointsToWin && gameState.gameScore.enemy < finalPointsToWin && (
              <>
                {gameState.gameScore.player === 0 && gameState.gameScore.enemy === 0 && !gameState.gamePaused ? (
                  <button
                    onClick={startGame}
                    disabled={gameLoading}
                    className="px-6 py-3 bg-text-tertiary text-background-primary rounded-lg font-semibold hover:bg-opacity-80 transition-colors disabled:opacity-50"
                  >
                    {gameLoading ? "Creating Game..." : t?.start || "Start"}
                  </button>
                ) : (
                  <button
                    onClick={pauseGame}
                    className="px-6 py-3 bg-text-tertiary text-background-primary rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
                  >
                    {gameState.gamePaused ? t?.pause || "Pause" : t?.resume || "Resume"}
                  </button>
                )}
              </>
            )}
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-text-secondary text-background-primary rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
            >
              {t?.reset || "Reset"}
            </button>
          </div>
          <div className="text-center text-text-secondary text-sm max-w-md">
            <p className="mb-2">
              {gameData?.player1.alias || "Jugador 1"}: W/S | {gameData?.player2.alias || "Jugador 2"}: O/L
            </p>
            <p>{t?.firstToScore || `Primero en llegar a ${finalPointsToWin} puntos gana!`}</p>
            {gameError && <p className="text-red-400 mt-2">Error: {gameError.message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleMatch
