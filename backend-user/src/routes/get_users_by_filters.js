import db from '../database/database.js';
import DatabaseQuery from '../database/database_query.js';

export default async function get_users_by_filters( request, reply )
{
	/* Get the filters */
	const { name, limit, page } = request.query;

	const completeQuery = new DatabaseQuery(
		"users",
		["id", "name"]
	);

	/* Check filter by name */
	if (name !== undefined)
		completeQuery.add_where([{key: "name", action: 'LIKE', value: `%${name}%`}], undefined);
	
	/* Added default by id */
	completeQuery.add_order_by("id");

	if (limit !== undefined)
	{
		completeQuery.add_limit(limit);
		if (page !== undefined)
			completeQuery.add_offset(limit * (page - 1));
	}


	/* Execute the query and return the result */
	try
	{
		const { query, params } = completeQuery.generate();
		const users = db.prepare(query).all(...params);
		return reply.code(200).send(users);
	}
	catch( err )
	{
		return reply.code(500).send({ error: err });
	}
}