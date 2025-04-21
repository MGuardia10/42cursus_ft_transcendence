export default async function logout(request, reply)
{
	/* Clear cookie */
	console.log('token: ', request.cookies.token);

	return reply.clearCookie('token', {
		sameSite: 'None',
		secure: true,
		httpOnly: true,
		path: '/',
		expires: 0
	}).code(200).send();
}