import { update_game } from "../utils/games.js"
import db from "../database/database.js"

function update_player_stats(player_id, won, points_scored, points_conceded) {
  console.log("📊 Backend: Updating player stats:", {
    player_id,
    won,
    points_scored,
    points_conceded,
  })

  try {
    // Obtener stats actuales antes de actualizar
    const currentStats = db.prepare("SELECT * FROM players WHERE id = ?").get(player_id)
    console.log("📊 Backend: Current stats before update:", currentStats)

    if (won) {
      // Incrementar victorias y puntos ganados
      const result = db
        .prepare(`
        UPDATE players 
        SET win_count = win_count + 1, 
            win_points = win_points + ? 
        WHERE id = ?
      `)
        .run(points_scored, player_id)

      console.log("✅ Backend: Winner update result:", result)
    } else {
      // Incrementar derrotas y puntos perdidos
      const result = db
        .prepare(`
        UPDATE players 
        SET lose_count = lose_count + 1, 
            lose_points = lose_points + ? 
        WHERE id = ?
      `)
        .run(points_conceded, player_id)

      console.log("✅ Backend: Loser update result:", result)
    }

    // Verificar stats después de actualizar
    const updatedStats = db.prepare("SELECT * FROM players WHERE id = ?").get(player_id)
    console.log("📊 Backend: Updated stats after update:", updatedStats)
  } catch (error) {
    console.error("❌ Backend: Error updating player stats:", error)
    throw error
  }
}

export default async function game_update(request, reply) {
  const { id } = request.params
  const { state, player_a_score, player_b_score } = request.body

  console.log("🎮 Backend: Updating game:", {
    id,
    state,
    player_a_score,
    player_b_score,
  })

  try {
    // Obtener información del juego antes de actualizarlo
    const game_info = db.prepare("SELECT * FROM games WHERE id = ?").get(id)

    if (!game_info) {
      console.log("❌ Backend: Game not found:", id)
      return reply.code(404).send({ error: "Game not found" })
    }

    console.log("🎮 Backend: Current game info:", game_info)

    // Actualizar el juego
    update_game(id, {
      state,
      player_a_score,
      player_b_score,
    })

    // Si el juego ha terminado, actualizar estadísticas de jugadores
    if (state === "Finished" && player_a_score !== undefined && player_b_score !== undefined) {
      console.log("🏁 Backend: Game finished, updating player stats...")

      const player_a_won = player_a_score > player_b_score
      const player_b_won = player_b_score > player_a_score

      console.log("🏆 Backend: Winner determination:", {
        player_a_id: game_info.player_a_id,
        player_b_id: game_info.player_b_id,
        player_a_score,
        player_b_score,
        player_a_won,
        player_b_won,
      })

      // Actualizar stats del jugador A
      update_player_stats(game_info.player_a_id, player_a_won, player_a_score, player_b_score)

      // Actualizar stats del jugador B
      update_player_stats(game_info.player_b_id, player_b_won, player_b_score, player_a_score)

      console.log("✅ Backend: Player stats updated successfully")
    } else {
      console.log("⚠️ Backend: Game not finished or missing scores:", { state, player_a_score, player_b_score })
    }

    console.log("✅ Backend: Game update completed")
    return reply.code(200).send({ success: true })
  } catch (err) {
    console.error("💥 Backend: Error updating game:", err)
    return reply.code(500).send({ error: err.message || "Internal server error" })
  }
}
