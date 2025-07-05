import db from "../database/database.js";

export default async function game_get_by_id(request, reply) {
  /* Get the player id to check, if it was sent */
  const { id } = request.params;

  /* Get all the query params, and execute the query */
  try {
    // Prepare the query to get the game by ID
    const result = db.prepare("SELECT * FROM games WHERE id = ?").get(id);

    // If no game is found, return a 404 error
    if (!result) {
      return reply.code(404).send({ error: "Game not found" });
    }

    // Format the result
    return reply.code(200).send(result);
  } catch (err) {
    return reply.code(500).send({ error: err });
  }
}
