"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { IoGameController, IoArrowBack } from "react-icons/io5"
import { FaUserFriends } from "react-icons/fa"

import { useLanguage } from "@/hooks/useLanguage"
import { useFriends } from "@/hooks/useFriends"
import { useNotification } from "@/hooks/useNotification"
import { useAuth } from "@/hooks/useAuth"
import type { Friend } from "@/types/friendsContext"
import Spinner from "@/layout/Spinner/Spinner"
import TwoFactorInput from "@/pages/TwoFactorAuth/components/TwoFactorInput"

const GameInvite: React.FC = () => {
  const { t } = useLanguage()
  const { friends, loading } = useFriends()
  const { addNotification } = useNotification()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [invitationSent, setInvitationSent] = useState(false)
  const [pendingInvitations, setPendingInvitations] = useState<GameInvitation[]>([])
  const [waitingForResponse, setWaitingForResponse] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [verificationCode, setVerificationCode] = useState<string>("")

  const handleInviteFriend = async (friend: Friend) => {
    if (!user) return

    setSelectedFriend(friend)
    setWaitingForResponse(true)

    try {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setVerificationCode(code)

      // Send email with the verification code
      const response = await fetch(`${import.meta.env.VITE_EMAIL_API_BASEURL_EXTERNAL}/send-invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: friend.email,
          subject: t("game_invite_email_subject") || "Invitación a jugar",
          message: `${t("game_invite_email_message") || `Hola ${friend.alias}, te invitamos a jugar.`} Tu código de verificación es: ${code}`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      addNotification(`${t("game_invitation_sent")} ${friend.alias}`, "success")
    } catch (error) {
      addNotification(`${t("game_invitation_email_error") || "Error al enviar el correo"}: ${error}`, "error")
      setWaitingForResponse(false)
      return
    }
  }

  const handleCodeComplete = async (code: string) => {
    try {
      // Verify the code matches the one we generated
      if (code === verificationCode) {
        addNotification(t("tfa_success") || "Código de autenticación correcto", "success")

        // Redirect to the single match page
        window.location.href = "https://localhost:8080/single-match"
      } else {
        throw new Error("Invalid code")
      }
    } catch (error) {
      addNotification(t("tfa_error") || "Código de autenticación incorrecto", "error")
      setResetKey((k) => k + 1)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center bg-background-primary p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
          </button>

          <div className="flex items-center justify-center gap-3 mb-4">
            <IoGameController className="text-4xl text-text-tertiary" />
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              {t("game_invite_title") || "Invitar a Jugar"}
            </h1>
          </div>
          <p className="text-text-secondary">
            {t("game_invite_description") || "Selecciona un amigo para invitarlo a una partida"}
          </p>
        </div>

        {/* Estado de espera con TFA */}
        {waitingForResponse && selectedFriend && (
          <div className="mb-8 p-6 bg-background-secondary rounded-lg border border-text-tertiary text-center">
            <TwoFactorInput onComplete={handleCodeComplete} resetKey={resetKey} />
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
                  {t("no_friends_available") || "No tienes amigos disponibles para invitar"}
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-4 max-h-[75vh] overflow-y-auto pr-1 ${
                  friends.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
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
                        <p className="font-semibold text-text-primary">{friend.alias}</p>
                        <p className="text-sm text-green-500">{t("online") || "En línea"}</p>
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
  )
}

export default GameInvite
