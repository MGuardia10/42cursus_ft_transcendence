import db from "../database/database.js";

export default async function player_delete( request, reply )
{
	const { id } = request.params;
	const { token } = request.cookies;

	/* Check if the JWT user is the one trying to delete the account */
	try
	{
		const response = await fetch(`${process.env.AUTH_API_BASEURL_INTERNAL}/me`, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`
			}
		})
		const { user_id } = await response.json();

		if (user_id != id)
			return reply.code(401).send({ error: "Only a user can delete his or her own account"})
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}

	/* Change the active flag */
	db
		.prepare("UPDATE players SET active = ? WHERE id = ?")
		.run(0, id)
	
	return reply.code(200).send();
}
