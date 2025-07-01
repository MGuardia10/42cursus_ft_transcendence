import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../../hooks/useLanguage";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useGame } from "@/hooks/useGame";
// import { usePlayer } from "@/hooks/usePlayer";
import { useNotification } from "@/hooks/useNotification";
import { useAuth } from "@/hooks/useAuth";
import {
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  BALL_SIZE,
  PADDLE_SPEED,
  BALL_SPEED,
  GameData,
  GameState,
} from "@/types/gameTypes";
import Scoreboard from "./components/Scoreboard";
import FieldLayout from "./components/FieldLayout";
import GameControls from "./components/GameControls";

const SingleMatch: React.FC = () => {
  // Hooks
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const {
    createGame,
    updateGame,
    loading: gameLoading,
    error: gameError,
  } = useGame();

  // const { refreshPlayerStats } = usePlayer();

  // Get player game settings
  const {
    ballColor,
    bgColor,
    barColor,
    serveDelay,
    score,
    defaultValue,
    loading: settingsLoading,
  } = useGameSettings();

  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const redirectAttemptedRef = useRef(false);

  // Load player data from sessionStorage
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [backendGameId, setBackendGameId] = useState<number | null>(null);
  const [gameCreated, setGameCreated] = useState(false);
  const [gameUpdated, setGameUpdated] = useState(false);

  const updateGameCalledRef = useRef(false);

  useEffect(() => {
    if (redirectAttemptedRef.current) return;

    const storedGameData = sessionStorage.getItem("gameData");
    if (storedGameData) {
      try {
        const parsedData = JSON.parse(storedGameData);
        setGameData(parsedData);
      } catch (error) {
        console.error("Error parsing game data:", error);
        addNotification("Error loading game data", "error");
        redirectAttemptedRef.current = true;
        navigate("/game-invite");
      }
    } else {
      // No game data found, redirect to game invite
      addNotification("No game data found. Please start a new game.", "error");
      redirectAttemptedRef.current = true;
      navigate("/game-invite");
    }
  }, [addNotification, navigate]);

  const [gameState, setGameState] = useState<GameState>({
    ball: { x: 400, y: 300, dx: BALL_SPEED, dy: BALL_SPEED },
    playerPaddle: { y: 260 },
    enemyPaddle: { y: 260, direction: 1 },
    gameScore: { player: 0, enemy: 0 },
    gamePaused: false,
    gameWidth: 800,
    gameHeight: 600,
    ballSpeedMultiplier: 1,
  });

  // Clear game data when game ends
  useEffect(() => {
    if (gameEnded) {
      sessionStorage.removeItem("gameData");
    }
  }, [gameEnded]);

  // Use player's custom game settings only if custom settings are enabled and not loading
  const finalServeDelay =
    settingsLoading || defaultValue
      ? Number.parseInt(import.meta.env.VITE_SERVE_DELAY)
      : serveDelay;
  const finalPointsToWin =
    settingsLoading || defaultValue
      ? Number.parseInt(import.meta.env.VITE_POINTS_TO_WIN)
      : score;

  // 🔥 Función para crear una partida usando el hook
  const createBackendGame = useCallback(async () => {
    if (!gameData || !user || gameCreated) return;

    try {
      const result = await createGame({
        player_a_id: gameData.player1.id,
        player_b_id: gameData.player2.id,
      });

      if (result) {
        setBackendGameId(result.game_id);
        console.log("✅ Game created with ID:", result.game_id); // <--- AÑADIDO
        setGameCreated(true);
        setGameUpdated(false);
      } else {
        addNotification("Error creating game in backend", "error");
      }
    } catch (error) {
      console.error("Error creating backend game:", error);
      addNotification("Error creating game in backend", "error");
    }
  }, [gameData, user, gameCreated, createGame, addNotification]);

  const updateBackendGame = useCallback(
    async (playerScore: number, enemyScore: number) => {
      if (!backendGameId || gameUpdated || updateGameCalledRef.current) {
        return;
      }
      updateGameCalledRef.current = true;
      try {
        setGameUpdated(true);
        console.log("[SingleMatch] Llamando a updateBackendGame", {
          backendGameId,
          playerScore,
          enemyScore,
        });
        console.log("[SingleMatch] Game Data:", gameData);
        console.log(
          "[SingleMatch] Player A ID:",
          gameData?.player1.id,
          "| Player B ID:",
          gameData?.player2.id
        );
        console.log(
          "[SingleMatch] Sending to backend - Player A Score:",
          playerScore,
          "| Player B Score:",
          enemyScore
        );

        const success = await updateGame(backendGameId, {
          player_a_score: playerScore,
          player_b_score: enemyScore,
          state: "Finished",
        });
        if (success) {
          // 👉 Logs informativos
          console.log("✅ Game ID:", backendGameId);
          console.log(
            "🎯 Final Score - Player A:",
            playerScore,
            "| Player B:",
            enemyScore
          );
          if (gameData) {
            const winner =
              playerScore > enemyScore ? gameData.player1 : gameData.player2;
            console.log("🏆 Winner ID:", winner.id);
            console.log("🏆 Winner Name:", winner.alias);
          }
          // Refresh player stats after game completion
          // await refreshPlayerStats();
          addNotification("Game completed and stats updated!", "success");
        } else {
          setGameUpdated(false);
          updateGameCalledRef.current = false;
          addNotification("Error updating game result", "error");
        }
      } catch (error) {
        console.error("Error updating backend game:", error);
        addNotification("Error updating game result", "error");
        setGameUpdated(false);
        updateGameCalledRef.current = false;
      }
    },
    [backendGameId, gameUpdated, updateGame, addNotification, gameData]
  );

  const updateGameDimensions = useCallback(() => {
    if (gameRef.current) {
      const rect = gameRef.current.getBoundingClientRect();
      const width = Math.min(rect.width, 800);
      const height = Math.min(rect.height, 600);
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
      }));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", updateGameDimensions);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", updateGameDimensions);
    };
  }, [updateGameDimensions]);

  useEffect(() => {
    updateGameDimensions();
  }, [updateGameDimensions]);

  const gameLoop = useCallback(() => {
    setGameState((prev: GameState) => {
      if (!prev.gamePaused || gameEnded) return prev;

      const newState = { ...prev };
      const { gameWidth, gameHeight } = newState;

      // Jugador 1: solo W y S
      if (keysRef.current["w"] || keysRef.current["W"]) {
        newState.playerPaddle.y = Math.max(
          0,
          newState.playerPaddle.y - PADDLE_SPEED
        );
      }
      if (keysRef.current["s"] || keysRef.current["S"]) {
        newState.playerPaddle.y = Math.min(
          gameHeight - PADDLE_HEIGHT,
          newState.playerPaddle.y + PADDLE_SPEED
        );
      }

      // Jugador 2: teclas O y L
      if (keysRef.current["o"] || keysRef.current["O"]) {
        newState.enemyPaddle.y = Math.max(
          0,
          newState.enemyPaddle.y - PADDLE_SPEED
        );
      }
      if (keysRef.current["l"] || keysRef.current["L"]) {
        newState.enemyPaddle.y = Math.min(
          gameHeight - PADDLE_HEIGHT,
          newState.enemyPaddle.y + PADDLE_SPEED
        );
      }

      newState.ball.x += newState.ball.dx * (newState.ballSpeedMultiplier || 1);
      newState.ball.y += newState.ball.dy * (newState.ballSpeedMultiplier || 1);

      if (newState.ball.y <= 0 || newState.ball.y >= gameHeight - BALL_SIZE) {
        newState.ball.dy *= -1;
      }

      if (
        newState.ball.x <= PADDLE_WIDTH &&
        newState.ball.y >= newState.playerPaddle.y &&
        newState.ball.y <= newState.playerPaddle.y + PADDLE_HEIGHT &&
        newState.ball.dx < 0
      ) {
        newState.ball.dx *= -1;
        const hitPos =
          (newState.ball.y - newState.playerPaddle.y) / PADDLE_HEIGHT;
        newState.ball.dy = (hitPos - 0.5) * BALL_SPEED * 2;
        newState.ballSpeedMultiplier = (newState.ballSpeedMultiplier || 1) * 1.5;
      }

      if (
        newState.ball.x >= gameWidth - PADDLE_WIDTH - BALL_SIZE &&
        newState.ball.y >= newState.enemyPaddle.y &&
        newState.ball.y <= newState.enemyPaddle.y + PADDLE_HEIGHT &&
        newState.ball.dx > 0
      ) {
        newState.ball.dx *= -1;
        const hitPos =
          (newState.ball.y - newState.enemyPaddle.y) / PADDLE_HEIGHT;
        newState.ball.dy = (hitPos - 0.5) * BALL_SPEED * 2;
        newState.ballSpeedMultiplier = (newState.ballSpeedMultiplier || 1) * 1.5;
      }

      if (newState.ball.x < -BALL_SIZE) {
        newState.gameScore.enemy++;
        newState.ball = {
          x: gameWidth / 2,
          y: gameHeight / 2,
          dx: 0,
          dy: 0,
        };
        newState.ballSpeedMultiplier = 1;

        setTimeout(() => {
          setGameState((prev: GameState) => ({
            ...prev,
            ball: {
              ...prev.ball,
              dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
              dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
            },
          }));
        }, finalServeDelay * 1000);

        if (newState.gameScore.enemy >= finalPointsToWin) {
          newState.gamePaused = false;
          setGameEnded(true);
          if (!gameUpdated) {
            updateBackendGame(
              newState.gameScore.player,
              newState.gameScore.enemy
            );
          }
        }
      } else if (newState.ball.x > gameWidth + BALL_SIZE) {
        newState.gameScore.player++;
        newState.ball = {
          x: gameWidth / 2,
          y: gameHeight / 2,
          dx: 0,
          dy: 0,
        };
        newState.ballSpeedMultiplier = 1;

        setTimeout(() => {
          setGameState((prev: GameState) => ({
            ...prev,
            ball: {
              ...prev.ball,
              dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
              dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
            },
          }));
        }, finalServeDelay * 1000);

        if (newState.gameScore.player >= finalPointsToWin) {
          newState.gamePaused = false;
          setGameEnded(true);
          if (!gameUpdated) {
            updateBackendGame(
              newState.gameScore.player,
              newState.gameScore.enemy
            );
          }
        }
      }

      return newState;
    });

    if (!gameEnded) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [
    finalServeDelay,
    finalPointsToWin,
    updateBackendGame,
    gameEnded,
    gameUpdated,
  ]);

  const pauseGame = () => {
    setGameState((prev: GameState) => ({
      ...prev,
      gamePaused: !prev.gamePaused,
    }));
  };

  const startGame = async () => {
    if (!gameCreated) {
      await createBackendGame();
    }

    setGameState((prev: GameState) => ({
      ...prev,
      gamePaused: true,
    }));
  };

  useEffect(() => {
    if (gameState.gamePaused && !gameEnded) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState.gamePaused, gameLoop, gameEnded]);

  // Use player's custom ball color only if custom settings are enabled and not loading
  const finalBallColor =
    settingsLoading || defaultValue
      ? `#${import.meta.env.VITE_BALL_COLOR}`
      : ballColor;
  const finalBgColor =
    settingsLoading || defaultValue
      ? `#${import.meta.env.VITE_FIELD_COLOR}`
      : bgColor;
  const finalBarColor =
    settingsLoading || defaultValue
      ? `#${import.meta.env.VITE_STICK_COLOR}`
      : barColor;

  // Función para obtener la URL absoluta del avatar
  const getAvatarUrl = (avatar: string | undefined | null): string => {
    if (!avatar || avatar.trim() === "") return "/placeholder.svg";
    if (avatar.startsWith("http")) return avatar;
    const baseUrl = import.meta.env.VITE_API_URL || "";
    return `${baseUrl}${avatar}`;
  };

  // Show loading if game settings are loading
  if (settingsLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-text-tertiary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading game settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-background-primary">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            {t("singleMatch")}
          </h1>
          <p className="text-text-secondary">{t("single_match_play")}</p>
        </div>

        {/* Scoreboard */}
        <Scoreboard
          player1={{ id: gameData?.player1.id?.toString() || "", alias: gameData?.player1.alias || "" }}
          player2={{ id: gameData?.player2.id?.toString() || "", alias: gameData?.player2.alias || "" }}
          score={gameState.gameScore}
        />

        {/* FieldLayout */}
        <FieldLayout
          gameRef={gameRef as React.RefObject<HTMLDivElement>}
          gameState={gameState}
          finalBgColor={finalBgColor}
          finalBarColor={finalBarColor}
          finalBallColor={finalBallColor}
          finalPointsToWin={finalPointsToWin}
          t={t as (key: string) => string}
          gameData={gameData}
        />

        {/* Game Controls */}
        <GameControls
          gameState={gameState}
          gameEnded={gameEnded}
          gameLoading={gameLoading}
          onStart={startGame}
          onPause={pauseGame}
          onBackToHome={() => navigate("/")}
          t={t as (key: string) => string}
          finalPointsToWin={finalPointsToWin}
          gameData={gameData}
          gameError={gameError}
        />
      </div>
    </div>
  );
};

export default SingleMatch;