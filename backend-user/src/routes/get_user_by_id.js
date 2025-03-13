import db from '../database/database.js';
import fs from 'fs';

export async function get_user_by_id(request, reply)
{
	/* Get the id */
	const { id } = request.params;
	
	/* Get all the user information */
	try
	{
		const user = db.prepare("SELECT name, email, tfa FROM users WHERE id = ?").get(id);
		return user
			? reply.code(200).send({ name: user.name, email: user.email, tfa: user.tfa })
			: reply.code(404).send({ error: "User not found" });
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}

export async function get_user_avatar_by_id(request, reply)
{
	/* Extract the id */
	const { id } = request.params;

	try
	{
		/* Get the avatar path */
		const avatar_path = db.prepare("SELECT avatar FROM users WHERE id = ?").get(id).avatar;
		if (!avatar_path || !fs.existsSync(avatar_path))
			return reply.code(404).send({ error: `Avatar not found: ${avatar_path}` });

		/* Return the file witg a read stream */
		return reply.type('image/jpeg').code(200).send(fs.createReadStream(avatar_path));
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}