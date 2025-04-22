import { modify_jwt } from '../utils/jwt.js';

export default async function update (request, reply)
{
	/* Get the token and the language to change */
	const { token } = request.cookies;
	const { language } = request.body;

	/* Try to modify the token */
	const new_jwt = modify_jwt(token, 'language', language);

	/* Check if the modification was executed correctly */
	return new_jwt.valid
		? reply.setCookie('token', new_jwt.token, {
			sameSite: 'None',
			secure: true,
			httpOnly: true,
			path: '/',
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
		}).code(200).send()
		: reply.code(401).send({ error: new_jwt.msg });
}
