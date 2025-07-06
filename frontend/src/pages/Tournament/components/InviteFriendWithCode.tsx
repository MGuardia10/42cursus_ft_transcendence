/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { Player } from "@/types/tournamentTypes";
import TournamentCodeInput from "./TournamentCodeInput";

interface InviteFriendWithCodeProps {
  friend: Player;
  user: any;
  apiUrl: string;
  addNotification: (msg: string, type: "success" | "error") => void;
  validatedUsers: Set<number>;
  setValidatedUsers: React.Dispatch<React.SetStateAction<Set<number>>>;
  isFull: boolean;
  setParticipants: React.Dispatch<React.SetStateAction<Player[]>>;
  t: (key: string) => string;
}

const InviteFriendWithCode: React.FC<InviteFriendWithCodeProps> = ({
  friend,
  user,
  apiUrl,
  addNotification,
  validatedUsers,
  setValidatedUsers,
  isFull,
  setParticipants,
  t,
}) => {
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resetKey, setResetKey] = useState(0);

  // Invitar amigo a torneo
  const handleInviteFriend = async () => {
    if (!user) return;
    setWaitingForResponse(true);
    setInputVisible(true);
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
      });
      if (!response.ok) {
        let errorMessage = t("game_invitation_error");
        switch (response.status) {
          case 400:
            errorMessage = t("bad_request_error");
            break;
          case 401:
            errorMessage = t("unauthorized_error");
            break;
          case 403:
            errorMessage = t("self_invite_error");
            break;
          case 404:
            errorMessage = t("user_not_found_error");
            break;
          default:
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setVerificationCode(data.hash);
      // Mantener waitingForResponse como true hasta que se valide el código
    } catch (error) {
      addNotification(`${error}`, "error");
      setWaitingForResponse(false);
      setInputVisible(false);
      setResetKey((k) => k + 1);
      return;
    }
  };

  // Validar código de invitación
  const handleCodeComplete = async (code: string) => {
    if (!verificationCode) {
      addNotification(t("no_hash_error"), "error");
      return;
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
      });
      if (!response.ok) {
        let errorMessage = t("tfa_error");
        switch (response.status) {
          case 400:
            errorMessage = t("bad_request_error");
            break;
          case 401:
            errorMessage = t("invalid_code_error");
            break;
          case 404:
            errorMessage = t("hash_not_found_error");
            break;
          case 429:
            errorMessage = t("max_attempts_error");
            setWaitingForResponse(false);
            setVerificationCode("");
            setResetKey((k) => k + 1);
            setInputVisible(false);
            break;
          default:
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      await response.json();
      addNotification(t("tfa_success"), "success");

      // Agregar usuario a la lista de validados
      setValidatedUsers((prev) => {
        const newValidatedUsers = new Set([...prev, friend.id]);

        // Añadir a participants si no está
        setParticipants((prevList) => {
          if (!prevList.some((p) => p.id === friend.id)) {
            return [...prevList, friend];
          }
          return prevList;
        });

        return newValidatedUsers;
      });

      setWaitingForResponse(false);
      setVerificationCode("");
      setInputVisible(false);
    } catch (error) {
      addNotification(`${error}`, "error");
      setResetKey((k) => k + 1);
    }
  };

  const isValidated = validatedUsers.has(friend.id);

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <img
            src={friend.avatar || "/placeholder.webp"}
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
              : "bg-text-tertiary text-background-primary hover:bg-opacity-80 cursor-pointer"
          }`}
          onClick={
            isValidated || waitingForResponse || isFull
              ? undefined
              : handleInviteFriend
          }
          disabled={isValidated || waitingForResponse || isFull}
        >
          {isValidated
            ? t("tournament_invited")
            : waitingForResponse
            ? t("tournament_pending")
            : isFull
            ? t("tournament_full")
            : t("invite")}
        </button>
      </div>
      {inputVisible && verificationCode && !isValidated && (
        <div className="flex flex-col items-center">
          <div className="w-full -mb-2">
            <TournamentCodeInput
              length={6}
              onComplete={handleCodeComplete}
              resetKey={resetKey}
            />
          </div>
          <button
            className="w-full bg-[#d35d48] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#b94c39] transition-colors max-w-xs cursor-pointer"
            style={{ margin: "0 auto" }}
            onClick={() => {
              setInputVisible(false);
              setVerificationCode("");
              setWaitingForResponse(false);
            }}
          >
            {t("delete_cancel")}
          </button>
        </div>
      )}
    </li>
  );
};

export default InviteFriendWithCode;
