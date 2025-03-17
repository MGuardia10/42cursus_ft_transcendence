import db from '../database/database.js';
import DatabaseQuery from '../database/database_query.js';

export default async function get_friends_by_filters(request, reply)
{
	/* Get the query params */
	const { status, limit, page } = request.query;

	/* Prepare the query and the params */
	const completeQuery = new DatabaseQuery(
		"friends",
		["*"]
	);

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
			completeQuery.add_where([{key: "status", action: '=', value: status_id.id}], undefined);
		}
		catch(err)
		{
			return reply.code(500).send({ error: err });
		}
	}

	/* Check limit */
	if (limit)
	{
		completeQuery.add_limit(limit);
		if (page)
			completeQuery.add_offset(limit * (page - 1));
	}

	/* Make the query and return the data */
	try
	{
		const { query, params } = completeQuery.generate();
		const users = db.prepare(query).all(...params);
		return reply.code(200).send(users);
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}