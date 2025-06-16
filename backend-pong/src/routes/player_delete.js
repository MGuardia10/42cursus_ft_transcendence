import db from "../database/database.js";

export default async function player_delete( request, reply )
{
	const { id } = request.params;

	/* Change the active flag */
	db
		.prepare("UPDATE players SET active = ? WHERE id = ?")
		.run(0, id)
	
	return reply.code(200).send();
}
