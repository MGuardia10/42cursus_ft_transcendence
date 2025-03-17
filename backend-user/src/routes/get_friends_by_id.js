import db from '../database/database.js';
import DatabaseQuery from '../database/database_query.js';

export default async function get_friends_by_id(request, reply)
{
	/* Get the inputs */
	const { id } = request.params;
	const { status } = request.query;

	/* Check if the user exists */
	try
	{
		const user = db.prepare("SELECT id from users WHERE id = ?").get(id);
		if (!user)
			return reply.code(404).send({ error: "User not found" });
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}

	/* Generate the initial query */
	const completeQuery = new DatabaseQuery(
		"friends",
		["*"]
	);
	completeQuery.add_where([{key: "user_a", action: '=', value: id}, {key: "user_b", action: '=', value: id}], "OR");

	/* Check the filters applied */
	if (status)
	{
		/* Check if the status exists */
		try
		{
			const status_id = db.prepare("SELECT id FROM friend_status WHERE name = ?").get(status);
			if (!status_id)
				return reply.code(404).send({ error: "Friend status not found" });
			completeQuery.add_where([{key: "status", action: '=', value: status_id.id}], undefined, "AND");
		}
		catch
		{
			return reply.code(500).send({ error: err });
		}
	}

	/* Make the query */
	try
	{
		const { query, params } = completeQuery.generate();
		const friends = db.prepare(query).all(...params);
		return reply.code(200).send(friends);
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}