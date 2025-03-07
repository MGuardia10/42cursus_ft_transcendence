import db from '../database/database.js'

export default async function add_friend(request, reply)
{
	const { from, to } = request.body;

	/* Check if the relation already exists (is completed) */

	/* Check if the other user created the relation (sent a friend request) */

	/* If no relation is started, create one */

	reply.send('Created!');
}