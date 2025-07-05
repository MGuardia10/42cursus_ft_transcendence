import { useState } from "react";
import { useNavigate } from "react-router";
import { IoGameController } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { useLanguage } from "@/hooks/useLanguage";
import { useFriends } from "@/hooks/useFriends";
import { useNotification } from "@/hooks/useNotification";
import { useAuth } from "@/hooks/useAuth";
import type { Friend } from "@/types/friendsContext";
import Spinner from "@/layout/Spinner/Spinner";
import TwoFactorInput from "@/pages/TwoFactorAuth/components/TwoFactorInput";

const GameInvite: React.FC = () => {
  const { t } = useLanguage();
  const { friends, loading } = useFriends();
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleInviteFriend = async (friend: Friend) => {
    if (!user) return;

    setSelectedFriend(friend);
    setWaitingForResponse(true);

    try {
      // Send invitation using the auth API
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL}/send-invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Enable cookies for JWT
          body: JSON.stringify({
            id: friend.id,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          t("game_invitation_error") || "Error al enviar la invitación";

        switch (response.status) {
          case 400:
            errorMessage = t("bad_request_error") || "Solicitud incorrecta";
            break;
          case 401:
            errorMessage = t("unauthorized_error") || "No autorizado";
            break;
          case 403:
            errorMessage =
              t("self_invite_error") || "No puedes invitarte a ti mismo";
            break;
          case 404:
            errorMessage = t("user_not_found_error") || "Usuario no encontrado";
            break;
          default:
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setVerificationCode(data.hash); // Store the hash instead of generating a random code

      addNotification(
        `${t("game_invitation_sent")} ${friend.alias}`,
        "success"
      );
    } catch (error) {
      addNotification(`${error}`, "error");
      setWaitingForResponse(false);
      setSelectedFriend(null);
      return;
    }
  };

  const handleCodeComplete = async (code: string) => {
    if (!verificationCode) {
      addNotification(
        t("no_hash_error") || "Error: No hay hash de verificación",
        "error"
      );
      return;
    }

    try {
      // Verify the code using the auth API
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL}/verify-invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            hash: verificationCode,
            code: code,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          t("tfa_error") || "Código de autenticación incorrecto";

        switch (response.status) {
          case 400:
            errorMessage = t("bad_request_error") || "Solicitud incorrecta";
            break;
          case 401:
            errorMessage = t("invalid_code_error") || "Código incorrecto";
            break;
          case 404:
            errorMessage =
              t("hash_not_found_error") || "Hash de verificación no encontrado";
            break;
          case 429:
            errorMessage =
              t("max_attempts_error") ||
              "Máximo número de intentos alcanzado. Vuelve a invitar al usuario.";
            // Reset the state to allow sending a new invitation
            setWaitingForResponse(false);
            setSelectedFriend(null);
            setVerificationCode("");
            break;
          default:
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      await response.json();
      addNotification(
        t("tfa_success") || "Código de autenticación correcto",
        "success"
      );

      // set failed to 0
      setFailedAttempts(0);

      // Create game in the backend
      const gameResponse = await fetch(
        `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/games`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player_a_id: user?.id,
            player_b_id: selectedFriend?.id,
          }),
        }
      );

      if (!gameResponse.ok) {
        addNotification(t("game_create_error"), "error");

        navigate("/");
      }

      const { game_id } = await gameResponse.json();

      // Store player data for the game
      const gameData = {
        gameId: game_id,
        player1: {
          id: user?.id,
          name: user?.name,
          alias: user?.alias,
          avatar: user?.avatar,
        },
        player2: {
          id: selectedFriend?.id,
          name: selectedFriend?.alias,
          alias: selectedFriend?.alias,
          avatar: selectedFriend?.avatar,
        },
      };
      sessionStorage.setItem("gameData", JSON.stringify(gameData));

      // Redirect to the single match page
      navigate("/single-match");
    } catch (error) {
      addNotification(`${error}`, "error");
      setResetKey((k) => k + 1);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="container mx-auto flex flex-col items-center justify-center bg-background-primary p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 p-2 text-text-secondary hover:text-text-primary transition-colors"
          ></button>

          <div className="flex items-center justify-center gap-3 mb-4">
            <IoGameController className="text-4xl text-text-tertiary" />
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              {t("game_invite_title") || "Invitar a Jugar"}
            </h1>
          </div>
          <p className="text-text-secondary">
            {t("game_invite_description") ||
              "Selecciona un amigo para invitarlo a una partida"}
          </p>
        </div>

        {/* Estado de espera con TFA */}
        {waitingForResponse && selectedFriend && (
          <div className="mb-8 p-6 bg-background-secondary rounded-lg border border-text-tertiary text-center">
            <TwoFactorInput
              onComplete={handleCodeComplete}
              resetKey={resetKey}
            />
          </div>
        )}

        {/* Lista de amigos */}
        {!waitingForResponse && (
          <div className="bg-background-secondary rounded-lg p-6 ">
            <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <FaUserFriends className="text-text-tertiary" />
              {t("select_friend") || "Selecciona un Amigo"}
            </h2>

            {friends.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary">
                  {t("no_friends_available") ||
                    "No tienes amigos disponibles para invitar"}
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-4 max-h-[75vh] overflow-y-auto pr-1 ${
                  friends.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex flex-col p-4 bg-background-hover rounded-lg border border-background-primary hover:border-text-tertiary transition-all duration-300 cursor-pointer"
                    onClick={() => handleInviteFriend(friend)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.avatar || "/placeholder.svg"}
                        alt={friend.alias}
                        className="w-12 h-12 rounded-full border-2 border-text-tertiary object-cover"
                      />
                      <div>
                        <p className="font-semibold text-text-primary">
                          {friend.alias}
                        </p>
                        <p
                          className={`text-sm ${
                            friend.online
                              ? "text-green-500"
                              : "opacity-50 text-red-500"
                          }`}
                        >
                          {friend.online
                            ? `${t("home_online")}`
                            : `${t("home_offline")}`}
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-3 py-1.5 text-sm bg-text-tertiary text-background-primary rounded-lg hover:bg-opacity-80 transition-colors">
                      {t("invite") || "Invitar"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInvite;
