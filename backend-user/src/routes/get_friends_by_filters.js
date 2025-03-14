import db from '../database/database.js';

function add_param(query_fragment, new_param, query, params)
{
	params.push(new_param);
	return query + ` ${query_fragment}`;
}

export default async function get_friends_by_filters(request, reply)
{
	/* Get the query params */
	const { status, limit, page } = request.query;

	/* Prepare the query and the params */
	let query = "SELECT * FROM friends";
	let params = [];

	/* Check status */
	if (status)
	{
		try
		{
			/* Search the status */
			const status_id = db.prepare("SELECT id FROM friend_status WHERE name = ?").get(status);
			if (!status_id)
				return reply.code(404).send({ error: "Status not found" });
			
			/* Add it to the query and params */
			query = add_param("WHERE status = ?", status_id.id, query, params);
		}
		catch(err)
		{
			return reply.code(500).send({ error: err });
		}
	}

	/* Check limit */
	if (limit)
	{
		query = add_param("LIMIT ?", limit, query, params);
		if (page)
			query = add_param("OFFSET ?", limit * (page - 1), query, params);
	}

	/* Make the query and return the data */
	try
	{
		const users = db.prepare(query).all(...params);
		return reply.code(200).send(users);
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}