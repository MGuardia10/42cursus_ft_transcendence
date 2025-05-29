"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { IoGameController, IoArrowBack } from "react-icons/io5"
import { FaUserFriends } from "react-icons/fa"

import { useLanguage } from "@/hooks/useLanguage"
import { useFriends } from "@/hooks/useFriends"
import { useNotification } from "@/hooks/useNotification"
import { useAuth } from "@/hooks/useAuth"
import type { Friend } from "@/types/friendsContext"
import Spinner from "@/layout/Spinner/Spinner"

interface GameInvitation {
  id: string
  from: number
  to: number
  fromAlias: string
  status: "pending" | "accepted" | "declined"
  createdAt: Date
}

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

  // Simular sistema de invitaciones (en una app real esto sería WebSocket/Server-Sent Events)
  useEffect(() => {
    // Simular recepción de invitaciones
    const checkInvitations = () => {
      // Aquí iría la lógica real para obtener invitaciones del servidor
      const storedInvitations = localStorage.getItem("gameInvitations")
      if (storedInvitations) {
        const invitations: GameInvitation[] = JSON.parse(storedInvitations)
        const userInvitations = invitations.filter((inv) => inv.to === Number(user?.id) && inv.status === "pending")
        setPendingInvitations(userInvitations)
      }
    }

    const interval = setInterval(checkInvitations, 1000)
    checkInvitations()

    return () => clearInterval(interval)
  }, [user?.id])

  const handleInviteFriend = async (friend: Friend) => {
    if (!user) return

    setSelectedFriend(friend)
    setWaitingForResponse(true)

    // Crear invitación
    const invitation: GameInvitation = {
      id: `${Date.now()}-${Math.random()}`,
      from: Number(user.id),
      to: friend.id,
      fromAlias: user.alias || user.email,
      status: "pending",
      createdAt: new Date(),
    }

    // Guardar en localStorage (en una app real esto iría al servidor)
    const existingInvitations = JSON.parse(localStorage.getItem("gameInvitations") || "[]")
    existingInvitations.push(invitation)
    localStorage.setItem("gameInvitations", JSON.stringify(existingInvitations))

    setInvitationSent(true)
    addNotification(`${t("game_invitation_sent")} ${friend.alias}`, "success")

    // Simular timeout de invitación (30 segundos)
    setTimeout(() => {
      setWaitingForResponse(false)
      setInvitationSent(false)
      setSelectedFriend(null)
      addNotification(t("game_invitation_timeout"), "error")
    }, 30000)
  }

  const handleAcceptInvitation = (invitation: GameInvitation) => {
    // Actualizar estado de la invitación
    const existingInvitations = JSON.parse(localStorage.getItem("gameInvitations") || "[]")
    const updatedInvitations = existingInvitations.map((inv: GameInvitation) =>
      inv.id === invitation.id ? { ...inv, status: "accepted" } : inv,
    )
    localStorage.setItem("gameInvitations", JSON.stringify(updatedInvitations))

    addNotification(`${t("game_invitation_accepted")} ${invitation.fromAlias}`, "success")

    // Ir a SingleMatch
    navigate("/single-match/game")
  }

  const handleDeclineInvitation = (invitation: GameInvitation) => {
    // Actualizar estado de la invitación
    const existingInvitations = JSON.parse(localStorage.getItem("gameInvitations") || "[]")
    const updatedInvitations = existingInvitations.map((inv: GameInvitation) =>
      inv.id === invitation.id ? { ...inv, status: "declined" } : inv,
    )
    localStorage.setItem("gameInvitations", JSON.stringify(updatedInvitations))

    // Remover de pendientes
    setPendingInvitations((prev) => prev.filter((inv) => inv.id !== invitation.id))
    addNotification(`${t("game_invitation_declined")} ${invitation.fromAlias}`, "info")
  }

  // Verificar si la invitación fue aceptada
  useEffect(() => {
    if (waitingForResponse && selectedFriend) {
      const checkAcceptance = () => {
        const existingInvitations = JSON.parse(localStorage.getItem("gameInvitations") || "[]")
        const myInvitation = existingInvitations.find(
          (inv: GameInvitation) =>
            inv.from === Number(user?.id) && inv.to === selectedFriend.id && inv.status === "accepted",
        )

        if (myInvitation) {
          addNotification(`${selectedFriend.alias} ${t("game_invitation_accepted_by_friend")}`, "success")
          navigate("/single-match/game")
        }
      }

      const interval = setInterval(checkAcceptance, 1000)
      return () => clearInterval(interval)
    }
  }, [waitingForResponse, selectedFriend, user?.id, navigate, t])

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
            <IoArrowBack className="text-2xl" />
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

        {/* Invitaciones pendientes */}
        {pendingInvitations.length > 0 && (
          <div className="mb-8 p-6 bg-background-secondary rounded-lg border border-text-tertiary">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FaUserFriends className="text-text-tertiary" />
              {t("pending_invitations") || "Invitaciones Pendientes"}
            </h2>
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 bg-background-hover rounded-lg border border-background-primary"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${invitation.from}/avatar`}
                      alt={invitation.fromAlias}
                      className="w-12 h-12 rounded-full border-2 border-text-tertiary object-cover"
                    />
                    <div>
                      <p className="font-semibold text-text-primary">{invitation.fromAlias}</p>
                      <p className="text-sm text-text-secondary">{t("wants_to_play") || "Te invita a jugar"}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptInvitation(invitation)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {t("accept") || "Aceptar"}
                    </button>
                    <button
                      onClick={() => handleDeclineInvitation(invitation)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t("decline") || "Rechazar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado de espera */}
        {waitingForResponse && selectedFriend && (
          <div className="mb-8 p-6 bg-background-secondary rounded-lg border border-text-tertiary text-center">
            <Spinner />
            <p className="mt-4 text-text-primary">
              {t("waiting_for_response") || "Esperando respuesta de"} {selectedFriend.alias}...
            </p>
            <p className="text-sm text-text-secondary mt-2">
              {t("invitation_timeout") || "La invitación expirará en 30 segundos"}
            </p>
            <button
              onClick={() => {
                setWaitingForResponse(false)
                setInvitationSent(false)
                setSelectedFriend(null)
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("cancel") || "Cancelar"}
            </button>
          </div>
        )}

        {/* Lista de amigos */}
        {!waitingForResponse && (
          <div className="bg-background-secondary rounded-lg p-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-4 bg-background-hover rounded-lg border border-background-primary hover:border-text-tertiary transition-all duration-300 cursor-pointer"
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
                    <button className="px-4 py-2 bg-text-tertiary text-background-primary rounded-lg hover:bg-opacity-80 transition-colors">
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
