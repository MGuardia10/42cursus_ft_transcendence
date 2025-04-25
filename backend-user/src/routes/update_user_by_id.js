import db from "../database/database.js";

function update_field(id, field, value)
{
	db.prepare(`UPDATE users SET ${field} = ? WHERE id = ?`).run(value, id);
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
			update_field(id, "alias", alias);
			fields.push("alias");
		}

		if (language)
		{
			update_field(id, "language", language);
			fields.push("language");
		}

		if (tfa)
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

export { update_user_data_by_id };