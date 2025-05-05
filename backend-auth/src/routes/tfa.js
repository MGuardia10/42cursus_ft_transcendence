import db from "../database/database.js";
import { create_jwt } from "../utils/jwt.js";

function delete_hash(hash)
{
	db.prepare("DELETE FROM tfa_codes WHERE hash = ?").run(hash);
}

export default async function tfa(request, reply)
{
	/* Get the parameters */
	const { hash, code } = request.body;

	/* Check if the hash and the code are correct */
	const tmp_data = db.prepare("SELECT user_id, language, code, tries FROM tfa_codes WHERE hash = ?").get(hash);
	if (!tmp_data)
		return reply.code(401).send({ error: 'Hash not valid' });
	let { user_id, code: tmp_code, language, tries } = tmp_data;

	/* Check if the code is the correct one */
	if (tmp_code != code)
	{
		tries--;
		if (tries == 0)
		{
			delete_hash(hash);
			return reply.code(429).send({ error: 'The maximum number of attempts has been reached' });
		}
		else
		{
			db.prepare("UPDATE tfa_codes SET tries = ? WHERE hash = ?").run(tries, hash);
			return reply.code(401).send({ error: 'Incorrect code' });
		}
	}

	/* Else, the code is correct */
	delete_hash(hash);
	const token = create_jwt({
		user_id: user_id,
		language: language
	});
	return reply
		.setCookie('token', token, {
			sameSite: 'None',
			secure: true,
			httpOnly: true,
			path: '/',
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
		})
		.code(200).send();
}