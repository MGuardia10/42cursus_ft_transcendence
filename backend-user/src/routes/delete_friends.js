import db from '../database/database.js';

export default async function delete_friends(request, reply)
{
	const { from, to } = request.body;

	try
	{
		/* Search the relation */
		const relation = db
			.prepare("SELECT user_a, user_b FROM friends WHERE (user_a = ? and user_b = ?) or (user_a = ? and user_b = ?)")
			.get(from, to, to, from);

		if (!relation)
			return reply.code(404).send({ error: 'No relation found' });
		const { user_a, user_b } = relation;
			
		/* Delete the relation */
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