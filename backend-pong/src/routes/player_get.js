import db from "../database/database.js"

function get_player_stats(player_id) {
  console.log("🔍 Backend: Getting player stats for ID:", player_id)

  const result = db
    .prepare(
      `
      SELECT
        id,
        active,
        configuration_id,
        win_count,
        lose_count,
        win_points,
        lose_points
      FROM players WHERE id = ?`,
    )
    .get(player_id)

  console.log("📊 Backend: Player stats query result:", result)
  return result
}

function get_player_configuration(conf_id) {
  console.log("⚙️ Backend: Getting configuration for ID:", conf_id)

  const result = db
    .prepare(
      `
      SELECT
        default_value,
        points_to_win,
        serve_delay,
        ball_color,
        stick_color,
        field_color
      FROM configuration WHERE id = ?`,
    )
    .get(conf_id)

  console.log("⚙️ Backend: Configuration query result:", result)
  return result
}

function merge_player_data(stats, config) {
  const merged = {
    id: stats.id,
    active: stats.active,
    configuration: config,
    win_count: stats.win_count,
    lose_count: stats.lose_count,
    win_points: stats.win_points,
    lose_points: stats.lose_points,
  }

  console.log("🔗 Backend: Merged player data:", merged)
  return merged
}

export default async function player_get(request, reply) {
  const { id } = request.params
  console.log("🎯 Backend: GET /player/" + id + " - Request received")

  try {
    /* Search the player in the database */
    const player_stats = get_player_stats(id)
    if (!player_stats) {
      console.log("❌ Backend: Player not found for ID:", id)
      return reply.code(404).send({ error: "Player not found" })
    }

    /* Get the configuration data */
    const player_conf = get_player_configuration(player_stats.configuration_id)
    if (!player_conf) {
      console.log("❌ Backend: Player configuration not found for config ID:", player_stats.configuration_id)
      return reply.code(404).send({ error: "Player configuration not found" })
    }

    /* Merge all the data */
    const result = merge_player_data(player_stats, player_conf)
    console.log("✅ Backend: Sending player data:", result)

    return reply.code(200).send(result)
  } catch (error) {
    console.error("💥 Backend: Error in player_get:", error)
    return reply.code(500).send({ error: "Internal server error" })
  }
}
