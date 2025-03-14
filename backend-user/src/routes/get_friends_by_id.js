import db from '../database/database.js'

function add_param(query_fragment, new_param, query, params)
{
	params.push(new_param);
	return query + ` ${query_fragment}`;
}

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
	let query = "SELECT * FROM friends WHERE (user_a = ? OR user_b = ?)";
	let params = [id, id]

	/* Check the filters applied */
	if (status)
	{
		/* Check if the status exists */
		try
		{
			const status_id = db.prepare("SELECT id FROM friend_status WHERE name = ?").get(status);
			if (!status_id)
				return reply.code(404).send({ error: "Friend status not found" });
			query = add_param("AND status = ?", status_id.id, query, params);
		}
		catch
		{
			return reply.code(500).send({ error: err });
		}
	}

	/* Make the query */
	try
	{
		const friends = db.prepare(query).all(...params);
		return reply.code(200).send(friends);
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}