import db from "../database/database.js";

function get_results(id) {
  return db
    .prepare(
      `
		WITH ranking AS (
  			SELECT
    			ROW_NUMBER() OVER (
      				ORDER BY
	        			CAST((win_count * 100.0) / NULLIF(total_count, 0) AS INTEGER)
        				DESC
    			) AS position,
    			id,
    			CAST((win_count * 100.0) / NULLIF(total_count, 0) AS INTEGER)
      				AS win_percentage
  			FROM players
  			WHERE (total_count) > 0
		)
		SELECT
  			position,
			id,
  			win_percentage
		FROM ranking
		WHERE id = ?;
	`
    )
    .get(id);
}

export default async function ranking_specific_player(request, reply) {
  const { id } = request.params;

  /* Search the data */
  const result = get_results(id);
  return result
    ? reply.code(200).send(result)
    : reply.code(404).send({ error: "Player not found" });
}
