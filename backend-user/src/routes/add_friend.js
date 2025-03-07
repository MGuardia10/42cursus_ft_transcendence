import db from '../database/database.js'



export default async function add_friend(request, reply)
{
	const { from, to } = request.body;

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


	/* If no relation is started, create one */

	reply.send('Created!');
}