import { update_game } from "../utils/games.js";

export default async function game_update(request, reply)
{
	/* Save the input data */
	const { id } = request.params;
	const { state, player_a_score, player_b_score } = request.body;

	/* Call the function to update the data */
	try
	{
		update_game( id, {
			state,
			player_a_score,
			player_b_score
		});
		return reply.code(200).send();
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}