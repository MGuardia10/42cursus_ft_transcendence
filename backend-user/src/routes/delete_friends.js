import db from '../database/database.js'
import { get_user_avatar_by_id } from './get_user_by_id.js';

export default async function delete_friends(request, reply)
{
	const { from, to } = request.body;

	try
	{
		/* Search the relation */
		console.log("1")
		const relation = db
			.prepare("SELECT user_a, user_b FROM friends WHERE (user_a = ? and user_b = ?) or (user_a = ? and user_b = ?)")
			.get(from, to, to, from);

		if (!relation)
			return reply.code(404).send({ error: 'No relation found' });
		const { user_a, user_b } = relation;
			
		/* Delete the relation */
		console.log("2")
		db
			.prepare("DELETE FROM friends WHERE user_a = ? and user_b = ?")
			.run(user_a, user_b);
		
		return reply.code(200).send();
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}