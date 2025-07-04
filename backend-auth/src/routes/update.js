import { get_jwt, modify_jwt } from '../utils/jwt.js';

export default async function update (request, reply)
{
	/* Get the token and the language to change */
	const { token } = request.cookies;
	const { language } = request.body;
	
	/* Try to modify the token */
	const new_jwt = modify_jwt(token, 'language', language);

	/* Check if the modification was executed correctly */
	if (!new_jwt.valid)
		return reply.code(401).send({ error: new_jwt.msg });

	/* Get the user if from the token */
	const { user_id } = get_jwt(new_jwt.token).payload;

	/* Send the language update to the user container */
	await fetch(`${process.env.USER_API_BASEURL_INTERNAL}/${user_id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			language: language
		})
	});

	/* Set the new token in the cookie */
	return reply.setCookie('token', new_jwt.token, {
			sameSite: 'None',
			secure: true,
			httpOnly: true,
			path: '/',
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
		}).code(200).send();
}
