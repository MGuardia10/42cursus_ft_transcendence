import { get_jwt } from '../utils/jwt.js';

export default async function me(request, reply) {
	/* Get the token from the header */
	const { token } = request.cookies;

	/* Get the token information */
	const jwt = get_jwt(token);
	if (!jwt.valid)
		return reply.code(401).send({ error: jwt.msg });

	/* Return the payload */
	return reply.send(jwt.payload);
}
