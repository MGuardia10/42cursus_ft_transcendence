export default async function logout(request, reply)
{
	/* Clear cookie */
	return reply.clearCookie('token', {
		sameSite: 'None',
		secure: true,
		httpOnly: true,
		path: '/',
		expires: 0
	}).code(200).send();
}