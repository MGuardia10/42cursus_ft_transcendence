import db from '../database/database.js';
import fs from 'fs';

export async function get_user_by_id(request, reply)
{
	/* Get the id */
	const { id } = request.params;
	
	/* Get all the user information */
	try
	{
		const user = db.prepare("SELECT name, alias, email, language, tfa FROM users WHERE id = ?").get(id);
		return user
			? reply.code(200).send({ name: user.name, alias: user.alias, email: user.email, language: user.language, tfa: user.tfa })
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
		const avatar = db.prepare("SELECT avatar FROM users WHERE id = ?").get(id);
		if (!avatar || !fs.existsSync(avatar.avatar))
			return reply.code(404).send({ error: "Avatar not found" });

		/* Return the file witg a read stream */
		return reply.type('image/jpeg').code(200).send(fs.createReadStream(avatar.avatar));
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}