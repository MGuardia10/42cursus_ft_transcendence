import db from '../database/database.js';

function add_param(fragment, data, query, params)
{
	params.push(data);
	return query + ` ${fragment}`;
}

export default async function get_users( request, reply )
{
	/* Get the filters */
	const { name, limit, page } = request.query;

	let params = [];
	let query = "SELECT id, name FROM users";

	/* Check filter by name */
	if (name !== undefined)
		query = add_param("WHERE name LIKE ?", `%${name}%`, query, params);

	if (limit !== undefined)
	{
		query = add_param("LIMIT ?", limit, query, params);
		if (page !== undefined)
			query = add_param("OFFSET ?", page, query, params);
	}

	/* Execute the query and return the result */
	try
	{
		// return reply.code(200).send({query: query, params: params});
		const users = db.prepare(query).all(...params);
		return reply.code(200).send(users);
	}
	catch( err )
	{
		return reply.code(500).send({ error: err });
	}
}