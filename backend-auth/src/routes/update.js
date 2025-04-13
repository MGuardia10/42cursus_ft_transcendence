import { modify_jwt } from '../utils/jwt.js';

export default async function update (request, reply)
{
	/* Get the token and the language to change*/
	const token = request.headers.authorization;
	const { language } = request.body;

	/* Try to modify the token */
	const new_jwt = modify_jwt(token, 'language', language);

	/* Check if the modification was executed correctly */
	if (!new_jwt.valid)
		return reply.code(401).send({ error: new_jwt.msg });

	return new_jwt.valid
		? reply.code(200).send({ token: new_jwt.token })
		: reply.code(401).send({ error: new_jwt.msg });
}
