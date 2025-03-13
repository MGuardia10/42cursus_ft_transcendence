import db from '../database/database.js';

export async function get_user_by_id(request, reply)
{
	/* Get the id */
	const { id } = request.params;
	
	/* Get all the user information */
	try
	{
		const user = db.prepare("SELECT name, email, tfa FROM users WHERE id = ?").get(id);
		return user
		? reply.code(200).send({ name: user.name, email: user.email, tfa: user.tfa })
		: reply.code(404).send({ error: "User not found" });
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}
