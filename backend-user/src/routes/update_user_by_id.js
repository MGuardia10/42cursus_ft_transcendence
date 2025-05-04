import db from "../database/database.js";
import fs from "fs/promises";

function update_field(id, field, value)
{
	db.prepare(`UPDATE users SET ${field} = ? WHERE id = ?`).run(value, id);
}

function update_alias(id, value)
{
	/* Check if the alias is already used */
	const alias_search = db.prepare("SELECT * FROM users WHERE alias = ?").get(value);
	if (alias_search)
		return false;

	/* If not, set it */
	update_field(id, "alias", value);
	return true;
}

async function update_user_data_by_id(request, reply) {
	/* Get the params and the body data */
	const { id } = request.params;
	const { alias, language, tfa: bool_tfa } = request.body;
	const tfa = bool_tfa ? 1 : 0;
	
	/* Check if the user exists */
	try
	{
		const user = db.prepare("SELECT id FROM users WHERE id = ?").get(id);
		if (!user)
			return reply.code(404).send({ error: "User not found" });
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
	
	/* Update the fields */
	let fields = [];
	try
	{
		if (alias)
		{
			if (!update_alias(id, alias.toLowerCase()))
				return reply.code(409).send({ error: "The alias is already used by another user" });
			fields.push("alias");
		}

		if (language)
		{
			update_field(id, "language", language);
			fields.push("language");
		}

		if (bool_tfa !== undefined)
		{
			update_field(id, "tfa", tfa);
			fields.push("tfa");
		}
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}

	return reply.code(200).send({ updated_fields: fields });
}


async function update_user_avatar_by_id(request, reply)
{
	/* Get the id */
	const { id } = request.params;

	/* Check if the user exists */
	try
	{
		const user = db.prepare("SELECT avatar FROM users WHERE id = ?").get(id);
		if (!user)
			return reply.code(404).send({ error: "User not found" });
		
		/* Get the file */
		const data = await request.file();
		if (!data)
			return reply.code(400).send({ error: "No file provided" });
		
		/* Save the file */
		const buffer = await data.toBuffer();
		await fs.writeFile(user.avatar, buffer);

		return reply.code(200).send();
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
}

export { update_user_data_by_id, update_user_avatar_by_id };