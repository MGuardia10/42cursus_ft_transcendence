/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { useLanguage } from "../../hooks/useLanguage";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useGame } from "@/hooks/useGame";
import { useNotification } from "@/hooks/useNotification";
import { useAuth } from "@/hooks/useAuth";
import {
  PADDLE_SPEED,
  BALL_SPEED,
  GameData,
  GameState,
} from "@/types/gameTypes";
import Scoreboard from "./components/Scoreboard";
import FieldLayout from "./components/FieldLayout";
import GameControls from "./components/GameControls";

const PADDLE_HEIGHT_RATIO = 0.2; // 20% del alto del campo

// Nueva interfaz para datos de torneo
interface TournamentGameData {
  gameId: number;
  tournamentId: string;
  player1: {
    id: number;
    name: string;
    alias: string;
    avatar: string;
  };
  player2: {
    id: number;
    name: string;
    alias: string;
    avatar: string;
  };
  configuration: {
    default_value: boolean;
    points_to_win: string;
    serve_delay: string;
    ball_color: string;
    stick_color: string;
    field_color: string;
  };
}

const TournamentSingleMatch: React.FC = () => {
  // Hooks
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    findGame,
    updateGame,
    loading: gameLoading,
    error: gameError,
  } = useGame();

  // Get player game settings (fallback)
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

  // Load tournament game data from sessionStorage
  const [tournamentGameData, setTournamentGameData] = useState<TournamentGameData | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [backendGameId, setBackendGameId] = useState<number | null>(null);
  const [gameCreated, setGameCreated] = useState(false);
  const [gameUpdated, setGameUpdated] = useState(false);

  const updateGameCalledRef = useRef(false);

  // Función para limpiar datos de sesión y redirigir
  const clearSessionAndRedirect = useCallback((tournamentId: string) => {
    sessionStorage.removeItem("tournamentGameData");
    navigate(`/tournament/${tournamentId}`);
  }, [navigate]);

  useEffect(() => {
    if (redirectAttemptedRef.current) return;

    const storedTournamentData = sessionStorage.getItem("tournamentGameData");
    if (storedTournamentData) {
      try {
        const parsedData: TournamentGameData = JSON.parse(storedTournamentData);
        setTournamentGameData(parsedData);
        
        // Convertir a formato GameData
        const convertedGameData: GameData = {
          gameId: parsedData.gameId.toString(),
          player1: {
            id: parsedData.player1.id.toString(),
            alias: parsedData.player1.alias,
            avatar: parsedData.player1.avatar,
          },
          player2: {
            id: parsedData.player2.id.toString(),
            alias: parsedData.player2.alias,
            avatar: parsedData.player2.avatar,
          },
        };
        setGameData(convertedGameData);
      } catch (error) {
        addNotification(
          t("game_loading_error") || "Error loading tournament match data",
          "error"
        );
        redirectAttemptedRef.current = true;
        // Redirigir a torneo general si no hay tournamentId
        navigate("/tournament");
      }
    } else {
      // No tournament match data found, redirect to tournament
      addNotification(
        t("game_no_data_found") ||
          "No tournament match data found. Please return to tournament.",
        "error"
      );
      redirectAttemptedRef.current = true;
      navigate("/tournament");
    }
  }, [addNotification, navigate, t]);

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

  useEffect(() => {
    if (!gameData) return;

    // Initialize game state with player data
    setGameState((prev: GameState) => ({
      ...prev,
      playerPaddle: {
        y: prev.gameHeight / 2 - (prev.gameHeight * PADDLE_HEIGHT_RATIO) / 2,
      },
      enemyPaddle: {
        y: prev.gameHeight / 2 - (prev.gameHeight * PADDLE_HEIGHT_RATIO) / 2,
        direction: 1,
      },
      ball: {
        x: prev.gameWidth / 2,
        y: prev.gameHeight / 2,
        dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
        dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
      },
    }));
  }, [gameData]);

  // Clear game data when game ends
  useEffect(() => {
    if (gameEnded && tournamentGameData) {
      clearSessionAndRedirect(tournamentGameData.tournamentId);
    }
  }, [gameEnded, tournamentGameData, clearSessionAndRedirect]);

  // Use tournament configuration if available, otherwise fallback to user settings
  const finalServeDelay = tournamentGameData?.configuration
    ? Number.parseInt(tournamentGameData.configuration.serve_delay)
    : settingsLoading || defaultValue
    ? Number.parseInt(import.meta.env.VITE_SERVE_DELAY)
    : serveDelay;
    
  const finalPointsToWin = tournamentGameData?.configuration
    ? Number.parseInt(tournamentGameData.configuration.points_to_win)
    : settingsLoading || defaultValue
    ? Number.parseInt(import.meta.env.VITE_POINTS_TO_WIN)
    : score;

  // Función para crear una partida usando el hook
  const createBackendGame = useCallback(async () => {
    if (!gameData || !user || gameCreated) return;

    try {
      const result = await findGame({
        player_a_id: gameData.player1.id,
        player_b_id: gameData.player2.id,
        game_id: gameData.gameId,
      });

      if (result && result.game_id !== -1) {
        setBackendGameId(result.game_id);
        setGameCreated(true);
        setGameUpdated(false);
      } else {
        addNotification(
          t("game_no_available") || "No tournament match available",
          "error"
        );
        if (tournamentGameData) {
          clearSessionAndRedirect(tournamentGameData.tournamentId);
        } else {
          navigate("/tournament");
        }
      }
    } catch (error) {
      addNotification("Error creating tournament game in backend", "error");
    }
  }, [gameData, user, gameCreated, findGame, addNotification, navigate, t, tournamentGameData, clearSessionAndRedirect]);

  const updateBackendGame = useCallback(
    async (playerScore: number, enemyScore: number, end: boolean) => {
      if (!backendGameId || gameUpdated || updateGameCalledRef.current) {
        return;
      }
      updateGameCalledRef.current = true;
      try {
        setGameUpdated(true);

        const success = await updateGame(backendGameId, {
          player_a_score: playerScore,
          player_b_score: enemyScore,
          state: "Finished",
        });
        if (!success) {
          setGameUpdated(false);
          updateGameCalledRef.current = false;
          addNotification(
            t("game_update_error") ||
              "Error updating tournament game result. Redirecting to tournament...",
            "error"
          );
          if (tournamentGameData) {
            clearSessionAndRedirect(tournamentGameData.tournamentId);
          } else {
            navigate("/tournament");
          }
          return;
        }

        updateGameCalledRef.current = false;
        setGameUpdated(false);

        if (end) {
          addNotification(t("game_complete") || "Tournament match completed!", "success");
        }
      } catch (error) {
        setGameUpdated(false);
        updateGameCalledRef.current = false;
        addNotification(
          t("game_update_error") ||
            "Error updating tournament game result. Redirecting to tournament...",
          "error"
        );
        if (tournamentGameData) {
          clearSessionAndRedirect(tournamentGameData.tournamentId);
        } else {
          navigate("/tournament");
        }
      }
    },
    [backendGameId, gameUpdated, updateGame, addNotification, navigate, t, tournamentGameData, clearSessionAndRedirect]
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
    // Ratios y tamaños responsive
    const PADDLE_WIDTH_RATIO = 0.02;
    const BALL_SIZE_RATIO = 0.027;

    // Movimiento de paddle
    function movePaddle(
      y: number,
      up: boolean,
      gameHeight: number,
      paddleHeight: number,
      speed: number
    ) {
      if (up) return Math.max(0, y - speed);
      return Math.min(gameHeight - paddleHeight, y + speed);
    }

    // Colisión con paredes
    function checkWallCollision(
      ball: any,
      gameHeight: number,
      ballSize: number
    ) {
      if (ball.y <= 0 || ball.y >= gameHeight - ballSize) {
        ball.dy *= -1;
      }
    }

    // Colisión con paddle
    function checkPaddleCollision(
      ball: any,
      paddleY: number,
      paddleX: number,
      paddleHeight: number,
      paddleWidth: number,
      ballSize: number,
      dxCondition: boolean,
      ballSpeed: number
    ) {
      if (
        ball.x <= paddleX + paddleWidth &&
        ball.x + ballSize >= paddleX &&
        ball.y + ballSize >= paddleY &&
        ball.y <= paddleY + paddleHeight &&
        dxCondition
      ) {
        ball.dx *= -1;
        const hitPos = (ball.y + ballSize / 2 - paddleY) / paddleHeight;
        ball.dy = (hitPos - 0.5) * ballSpeed * 2;
        return true; // Hubo colisión
      }
      return false;
    }

    // Reiniciar bola
    function resetBall(gameWidth: number, gameHeight: number) {
      return {
        x: gameWidth / 2,
        y: gameHeight / 2,
        dx: 0,
        dy: 0,
      };
    }

    setGameState((prev: GameState) => {
      if (!prev.gamePaused || gameEnded) return prev;

      const newState = { ...prev };
      const { gameWidth, gameHeight } = newState;
      const paddleHeight = gameHeight * PADDLE_HEIGHT_RATIO;
      const paddleWidth = gameWidth * PADDLE_WIDTH_RATIO;
      const ballSize = gameWidth * BALL_SIZE_RATIO;

      // Movimiento paddles
      newState.playerPaddle.y = movePaddle(
        newState.playerPaddle.y,
        !!(keysRef.current["w"] || keysRef.current["W"]),
        gameHeight,
        paddleHeight,
        PADDLE_SPEED
      );
      newState.playerPaddle.y = movePaddle(
        newState.playerPaddle.y,
        !(keysRef.current["s"] || keysRef.current["S"]),
        gameHeight,
        paddleHeight,
        PADDLE_SPEED
      );
      newState.enemyPaddle.y = movePaddle(
        newState.enemyPaddle.y,
        !!(keysRef.current["o"] || keysRef.current["O"]),
        gameHeight,
        paddleHeight,
        PADDLE_SPEED
      );
      newState.enemyPaddle.y = movePaddle(
        newState.enemyPaddle.y,
        !(keysRef.current["l"] || keysRef.current["L"]),
        gameHeight,
        paddleHeight,
        PADDLE_SPEED
      );

      // Movimiento bola
      newState.ball.x += newState.ball.dx * (newState.ballSpeedMultiplier || 1);
      newState.ball.y += newState.ball.dy * (newState.ballSpeedMultiplier || 1);

      // Colisión con paredes
      checkWallCollision(newState.ball, gameHeight, ballSize);

      checkPaddleCollision(
        newState.ball,
        newState.playerPaddle.y,
        0,
        paddleHeight,
        paddleWidth,
        ballSize,
        newState.ball.dx < 0,
        BALL_SPEED
      );

      checkPaddleCollision(
        newState.ball,
        newState.enemyPaddle.y,
        gameWidth - paddleWidth,
        paddleHeight,
        paddleWidth,
        ballSize,
        newState.ball.dx > 0,
        BALL_SPEED
      );

      // Gol enemigo
      if (newState.ball.x < -ballSize && newState.ball.dx < 0) {
        newState.ball = resetBall(gameWidth, gameHeight);
        newState.gamePaused = false;
        newState.gameScore.enemy++;
        setTimeout(() => {
          setGameState((prev: GameState) => ({
            ...prev,
            gamePaused: true,
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
              newState.gameScore.enemy,
              true
            );
          }
        } else {
          updateBackendGame(
            newState.gameScore.player,
            newState.gameScore.enemy,
            false
          );
        }
      } else if (
        newState.ball.x > gameWidth + ballSize &&
        newState.ball.dx > 0
      ) {
        newState.ball = resetBall(gameWidth, gameHeight);
        newState.gamePaused = false;
        newState.gameScore.player++;
        setTimeout(() => {
          setGameState((prev: GameState) => ({
            ...prev,
            gamePaused: true,
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
              newState.gameScore.enemy,
              true
            );
          }
        } else {
          updateBackendGame(
            newState.gameScore.player,
            newState.gameScore.enemy,
            false
          );
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

  // Use tournament configuration colors if available, otherwise fallback to user settings
  const finalBallColor = tournamentGameData?.configuration
    ? `#${tournamentGameData.configuration.ball_color}`
    : settingsLoading || defaultValue
    ? `#${import.meta.env.VITE_BALL_COLOR}`
    : ballColor;
    
  const finalBgColor = tournamentGameData?.configuration
    ? `#${tournamentGameData.configuration.field_color}`
    : settingsLoading || defaultValue
    ? `#${import.meta.env.VITE_FIELD_COLOR}`
    : bgColor;
    
  const finalBarColor = tournamentGameData?.configuration
    ? `#${tournamentGameData.configuration.stick_color}`
    : settingsLoading || defaultValue
    ? `#${import.meta.env.VITE_STICK_COLOR}`
    : barColor;

  // Show loading if game settings are loading and no tournament configuration
  if (settingsLoading && !tournamentGameData?.configuration) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-text-tertiary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading tournament game settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-background-primary">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            {t("tournamentMatch") || "Tournament Match"}
          </h1>
          <p className="text-text-secondary">{t("tournament_match_play") || "Tournament match in progress"}</p>
        </div>

        {/* Scoreboard */}
        <Scoreboard
          player1={{
            id: gameData?.player1.id?.toString() || "",
            alias: gameData?.player1.alias || "",
          }}
          player2={{
            id: gameData?.player2.id?.toString() || "",
            alias: gameData?.player2.alias || "",
          }}
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
          onBackToHome={() => tournamentGameData ? clearSessionAndRedirect(tournamentGameData.tournamentId) : navigate("/tournament")}
          t={t as (key: string) => string}
          finalPointsToWin={finalPointsToWin}
          gameData={gameData}
          gameError={gameError}
        />
      </div>
    </div>
  );
};

export default TournamentSingleMatch; 