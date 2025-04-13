import db from '../database/database.js';
import DatabaseQuery from '../database/database_query.js';

export default async function get_users_by_filters( request, reply )
{
	/* Get the filters */
	const { alias, email, limit, page } = request.query;

	const completeQuery = new DatabaseQuery(
		"users",
		["id", "alias", "email"]
	);

	/* Check filter by name */
	if (alias)
		completeQuery.add_where([{key: "alias", action: 'LIKE', value: `%${alias}%`}], undefined);
	else if (email)
		completeQuery.add_where([{key: "email", action: '=', value: email}], undefined);

	/* Added default by id */
	completeQuery.add_order_by("id");

	if (limit)
	{
		completeQuery.add_limit(limit);
		if (page)
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