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

		/*
			Check that the user you are trying to
			delete is the same one you want to delete
		*/
		const token_check = await fetch(`${process.env.AUTH_API_BASEURL_INTERNAL}/me`, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`
			}
		});
		if (!token_check || !token_check.ok)
			throw new Error(token_check.statusText)
		
		/* Extract the fetch data */
		const token_check_json = await token_check.json()
		const auth_id = token_check_json.user_id;
		if (auth_id === undefined || auth_id != id)
			return reply.code(403).send({ error: "You cannot delete another user's account"})

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