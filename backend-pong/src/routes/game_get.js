import db from "../database/database.js";
import { format_game_data } from "../utils/games.js";

function analyze_query( player_id )
{
	/* Build the query */
	let query = "SELECT * FROM games";
	if (player_id !== undefined)
		query += " WHERE player_a_id = ? OR player_b_id = ?";
	query += " ORDER BY date DESC;"

	/* Save the query params */
	const params = player_id !== undefined
		? [player_id, player_id]
		: [];

	return { query, params };
}

export default async function game_get( request, reply )
{
	/* Get the player id to check, if it was sent */
	const { player } = request.query;

	/* Get all the query params, and execute the query */
	try
	{
		const { query, params } = analyze_query( player );
		const results = db.prepare(query).all(...params);

		const formatted_results = results.map(game => format_game_data(game))
		return reply.code(200).send(formatted_results);
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}


}