import db from '../database/database.js';

export default async function delete_user_by_id(request, reply) {
	/* Get the user id and the token */
	const { id } = request.params;
	const { token } = request.cookies;

	try
	{
		/* Check if the user exists */
		const user = db.prepare("SELECT id from users WHERE id = ?").get(id);
		if (!user)
			return reply.code(404).send({ error: "User not found" });

		/* Delete the user */
		db.prepare("DELETE FROM users WHERE id = ?").run(id);
	} catch (err) {
		return reply.code(500).send({ error: err });
	}

	/* Delete the player account */
	try
	{
		const response = await fetch(`${process.env.PONG_API_BASEURL_INTERNAL}/player/${id}`, {
			method: 'DELETE',
			headers: {
				'Cookie': `token=${token}`
			}
		});
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });	
	}
	
	return reply.clearCookie('token', {
		sameSite: 'None',
		secure: true,
		httpOnly: true,
		path: '/',
		expires: 0
	}).code(200).send();
}