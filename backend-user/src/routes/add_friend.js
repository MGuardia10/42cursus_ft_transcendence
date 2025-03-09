import db from '../database/database.js';

export default async function add_friend(request, reply)
{
	const { from, to } = request.body;

	try {
		/* Check if the users exists */
		const user_search = db.prepare("SELECT id FROM users WHERE id = ? OR id = ?").all(from, to);
		const users_found = user_search.map(user => user.id);
		const users_not_found = [from, to].filter(id => !users_found.includes(id));
		if (user_search.length != 2)
			return reply.code(404).send({ found: users_found, not_found: users_not_found  });

		/* Get the two possible friend status */
		const accepted_id = db.prepare("SELECT id FROM friend_status WHERE name = 'Accepted'").get()?.id;
		const pending_id = db.prepare("SELECT id FROM friend_status WHERE name = 'Pending'").get()?.id;
		if (!accepted_id || !pending_id)
			return reply.code(500).send({ error: 'Error on the database config: top friend statuses missing' });

		/* Check if the relation already exists (request or completed) */
		const search = db.prepare("SELECT user_a, status FROM friends WHERE (user_a = ? and user_b = ?) or (user_a = ? and user_b = ?)").get(from, to, to, from);
		if (search?.user_a)
		{
			const {user_a, status} = search;

			/* Check if it is accepted */
			if (status === accepted_id)
				return reply.code(400).send({ error: "The relationship already exists" });

			/* Check if the request was sent before */
			if (user_a === from)
				return reply.code(409).send({ error: "The request had already been sent" });

			/* Update the relation, accepting it */
			db.prepare("UPDATE friends SET status = ? WHERE user_a = ? AND user_b = ?").run(accepted_id, to, from);
			return reply.code(200).send({status: "Accepted" });
		}

		/* If no relation is started, create one */
		db.prepare("INSERT INTO friends(user_a, user_b, status) VALUES(?, ?, ?)").run(from, to, pending_id);
		return reply.code(201).send({ status: "Pending" });
	}
	catch( err )
	{
		return reply.code(500).send({ error: err });
	}
}