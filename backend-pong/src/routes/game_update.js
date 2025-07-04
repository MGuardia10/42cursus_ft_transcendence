import { update_game } from "../utils/games.js";
import db from "../database/database.js";

function update_player_stats(player_id, won, points_scored, points_conceded) {
  try {
    // Obtener stats actuales antes de actualizar
    const currentStats = db
      .prepare("SELECT * FROM players WHERE id = ?")
      .get(player_id);

    if (won) {
      // Incrementar victorias, puntos ganados Y puntos perdidos
      const result = db
        .prepare(
          `
        UPDATE players 
        SET win_count = win_count + 1, 
            win_points = win_points + ?,
            lose_points = lose_points + ?
        WHERE id = ?
      `
        )
        .run(points_scored, points_conceded, player_id);
    } else {
      // Incrementar derrotas, puntos perdidos Y puntos ganados
      const result = db
        .prepare(
          `
        UPDATE players 
        SET lose_count = lose_count + 1, 
            lose_points = lose_points + ?,
            win_points = win_points + ?
        WHERE id = ?
      `
        )
        .run(points_conceded, points_scored, player_id);
    }

    // Verificar stats después de actualizar
    const updatedStats = db
      .prepare("SELECT * FROM players WHERE id = ?")
      .get(player_id);
  } catch (error) {
    throw error;
  }
}

export default async function game_update(request, reply) {
  const { id } = request.params;
  const { state, player_a_score, player_b_score } = request.body;

  try {
    // Obtener información del juego antes de actualizarlo
    const game_info = db.prepare("SELECT * FROM games WHERE id = ?").get(id);

    if (!game_info) {
      return reply.code(404).send({ error: "Game not found" });
    }

    // Comprobar si el juego ya está terminado
    const statusRow = db
      .prepare("SELECT name FROM game_status WHERE id = ?")
      .get(game_info.status);
    if (statusRow && statusRow.name === "Finished") {
      return reply
        .code(200)
        .send({
          success: true,
          message: "Game already finished, stats not updated again.",
        });
    }

    // Actualizar el juego
    update_game(id, {
      state,
      player_a_score,
      player_b_score,
    });

    // Si el juego ha terminado, actualizar estadísticas de jugadores
    if (
      state === "Finished" &&
      player_a_score !== undefined &&
      player_b_score !== undefined
    ) {
      const player_a_won = player_a_score > player_b_score;
      const player_b_won = player_b_score > player_a_score;

      // Actualizar stats del jugador A
      update_player_stats(
        game_info.player_a_id,
        player_a_won,
        player_a_score,
        player_b_score
      );

      // Actualizar stats del jugador B
      update_player_stats(
        game_info.player_b_id,
        player_b_won,
        player_b_score,
        player_a_score
      );
    }

    return reply.code(200).send({ success: true });
  } catch (err) {
    return reply
      .code(500)
      .send({ error: err.message || "Internal server error" });
  }
}
