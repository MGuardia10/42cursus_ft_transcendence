"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useLanguage } from "../../hooks/useLanguage"
import { usePlayerConfig } from "@/hooks/usePlayerConfig"

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
  score: {
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
const SERVE_DELAY = 1 //BACK
const POINTS_TO_WIN = 5 //BACK

const SingleMatch: React.FC = () => {
  const { t } = useLanguage()
  const gameRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const keysRef = useRef<{ [key: string]: boolean }>({})

  // Load player data from sessionStorage
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [gameEnded, setGameEnded] = useState(false)

  // Load player configuration
  const { config: playerConfig, loading: configLoading } = usePlayerConfig()

  useEffect(() => {
    const storedGameData = sessionStorage.getItem("gameData")
    if (storedGameData) {
      try {
        const parsedData = JSON.parse(storedGameData)
        setGameData(parsedData)
        // Don't clear the data immediately - keep it for the duration of the game
      } catch (error) {
        console.error("Error parsing game data:", error)
      }
    }
  }, [])

  const [gameState, setGameState] = useState<GameState>({
    ball: { x: 400, y: 300, dx: BALL_SPEED, dy: BALL_SPEED },
    playerPaddle: { y: 260 },
    enemyPaddle: { y: 260, direction: 1 },
    score: { player: 0, enemy: 0 },
    gamePaused: false,
    gameWidth: 800,
    gameHeight: 600,
  })

  // Clear game data when game ends
  useEffect(() => {
    if (gameEnded) {
      // Clear the game data from sessionStorage when the game ends
      sessionStorage.removeItem("gameData")
    }
  }, [gameEnded])

  const updateGameDimensions = useCallback(() => {
    if (gameRef.current) {
      const rect = gameRef.current.getBoundingClientRect()
      const width = Math.min(rect.width, 800)
      const height = Math.min(rect.height, 600)
      setGameState((prev) => ({
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

  const resetBall = useCallback((gameWidth: number, gameHeight: number, withDelay = true) => {
    const newBall = {
      x: gameWidth / 2,
      y: gameHeight / 2,
      dx: 0,
      dy: 0,
    }
    if (withDelay) {
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          ball: {
            ...prev.ball,
            dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
            dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
          },
        }))
      }, SERVE_DELAY * 1000)
    } else {
      newBall.dx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED
      newBall.dy = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED
    }
    return newBall
  }, [])

  const gameLoop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.gamePaused) return prev
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
        newState.score.enemy++
        newState.ball = {
          x: gameWidth / 2,
          y: gameHeight / 2,
          dx: 0,
          dy: 0,
        }

        // Set ball movement after delay
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            ball: {
              ...prev.ball,
              dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
              dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
            },
          }))
        }, SERVE_DELAY * 1000)

        if (newState.score.enemy >= POINTS_TO_WIN) {
          newState.gamePaused = false
          setGameEnded(true)
        }
      } else if (newState.ball.x > gameWidth + BALL_SIZE) {
        newState.score.player++
        newState.ball = {
          x: gameWidth / 2,
          y: gameHeight / 2,
          dx: 0,
          dy: 0,
        }

        // Set ball movement after delay
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            ball: {
              ...prev.ball,
              dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
              dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
            },
          }))
        }, SERVE_DELAY * 1000)

        if (newState.score.player >= POINTS_TO_WIN) {
          newState.gamePaused = false
          setGameEnded(true)
        }
      }

      return newState
    })

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [resetBall])

  const pauseGame = () => {
    setGameState((prev) => ({
      ...prev,
      gamePaused: !prev.gamePaused,
    }))
  }

  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      ball: resetBall(prev.gameWidth, prev.gameHeight, false),
      playerPaddle: { y: prev.gameHeight / 2 - PADDLE_HEIGHT / 2 },
      enemyPaddle: { y: prev.gameHeight / 2 - PADDLE_HEIGHT / 2, direction: 1 },
      score: { player: 0, enemy: 0 },
      gamePaused: false,
    }))
    // Reset the game ended state to allow continuing the match
    setGameEnded(false)
  }

  useEffect(() => {
    if (gameState.gamePaused) {
      animationRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameState.gamePaused, gameLoop])

  const stadiumColor = "#1e1e1e" //BACK
  const paddleColor = "#00ffcc" //BACK

  // Determine ball color based on player config or environment default
  const ballColor =
    playerConfig?.default_value === false ? playerConfig.ball_color : import.meta.env.BALL_COLOR || "#974603"

  // Show loading while fetching config
  if (configLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-background-primary">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{t?.singleMatch || "Single Match"}</h1>
          <p className="text-text-secondary">{t("single_match_play")}</p>
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
            <div className="text-3xl font-bold text-text-tertiary">{gameState.score.player}</div>
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
            <div className="text-3xl font-bold text-text-tertiary">{gameState.score.enemy}</div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div
            ref={gameRef}
            className="relative border-2 border-border-primary rounded-lg overflow-hidden"
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              aspectRatio: "4/3",
              backgroundColor: stadiumColor,
            }}
          >
            <div
              className="absolute bg-border-primary opacity-50"
              style={{ left: "50%", top: 0, width: "2px", height: "100%", transform: "translateX(-50%)" }}
            />
            <div
              className="absolute rounded-sm"
              style={{
                left: 0,
                top: `${(gameState.playerPaddle.y / gameState.gameHeight) * 100}%`,
                width: `${(PADDLE_WIDTH / gameState.gameWidth) * 100}%`,
                height: `${(PADDLE_HEIGHT / gameState.gameHeight) * 100}%`,
                backgroundColor: paddleColor,
              }}
            />
            <div
              className="absolute rounded-sm"
              style={{
                right: 0,
                top: `${(gameState.enemyPaddle.y / gameState.gameHeight) * 100}%`,
                width: `${(PADDLE_WIDTH / gameState.gameWidth) * 100}%`,
                height: `${(PADDLE_HEIGHT / gameState.gameHeight) * 100}%`,
                backgroundColor: paddleColor,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                left: `${(gameState.ball.x / gameState.gameWidth) * 100}%`,
                top: `${(gameState.ball.y / gameState.gameHeight) * 100}%`,
                width: `${(BALL_SIZE / gameState.gameWidth) * 100}%`,
                height: `${(BALL_SIZE / gameState.gameHeight) * 100}%`,
                backgroundColor: ballColor,
              }}
            />
            {!gameState.gamePaused && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-2xl text-text-primary">
                  {gameState.score.player === 0 && gameState.score.enemy === 0
                    ? t?.pressToStart || "Press Start to Play"
                    : gameState.score.player >= POINTS_TO_WIN
                      ? `¡${gameData?.player1.alias || "Jugador 1"} gana!`
                      : gameState.score.enemy >= POINTS_TO_WIN
                        ? `¡${gameData?.player2.alias || "Jugador 2"} gana!`
                        : t?.gamePaused || "Game Paused"}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            {gameState.score.player < POINTS_TO_WIN && gameState.score.enemy < POINTS_TO_WIN && (
              <button
                onClick={pauseGame}
                className="px-6 py-3 bg-text-tertiary text-background-primary rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
              >
                {gameState.gamePaused ? t?.pause || "Pause" : t?.start || "Start"}
              </button>
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
            <p>{t?.firstToScore || `Primero en llegar a ${POINTS_TO_WIN} puntos gana!`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleMatch
