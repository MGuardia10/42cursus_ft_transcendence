import { create_game } from "../utils/games.js";

export default async function game_create( request, reply )
{
	const { player_a_id, player_b_id } = request.body;

	try
	{
		const game_id = create_game(player_a_id, player_b_id)
		return reply.code(200).send({game_id});
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}
