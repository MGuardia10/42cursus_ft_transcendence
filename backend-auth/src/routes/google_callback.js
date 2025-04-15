import url from 'url';
import { oauth2client } from '../google_oauth.js';
import { create_jwt } from '../utils/jwt.js';

async function create_user(baseurl, name, email, avatar_url)
{
	const { id } = await fetch (`${baseurl}/`, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			email,
			avatar_url
		})
	});

	return id;
}

async function manage_user(users_api, name, email, picture)
{
	/* Get the list */
	const users_response = await fetch (
		`${users_api}/?email=${email}`
	);
	const users_found = await users_response.json();

	/* Take action taking acoount if the user exists */
	return users_found.length == 0
		? create_user(users_api, name, email, picture)
		: users_found[0].id;
}

async function google_authentication(request, reply)
{
	/* Parse the link, divide it into parts */
	let q = url.parse(request.url, true).query;
	if (q.error)
		throw new Error(q.error);

	/* Get the tokens and send a request to get the info */
	const { tokens } = await oauth2client.getToken(q.code);
	oauth2client.setCredentials(tokens);

	const google_response = await fetch (`https://www.googleapis.com/oauth2/v3/userinfo`, {
		headers: {
			'Authorization': `Bearer ${tokens.access_token}`,
		}
	});
	return await google_response.json();
}

export default async function google_callback(request, reply)
{
	const users_api = process.env.USER_API_BASEURL_INTERNAL;

	try {
		/* Get the tokens and send a request to get the info */
		const { name, email, picture } = await google_authentication(request, reply);

		/* Manage the user creation or search */
		const user_id = await manage_user(users_api, name, email, picture);

		/* Create the user init token and return it */
		const token = create_jwt({
			user_id: user_id,
			language: process.env.DEFAULT_LANGUAGE
		});

		/* Save the token as a cookie */
		reply.header('set-cookie', `token=${token}; SameSite=None; Secure; HttpOnly; Path=/`);

		return reply
			.redirect(`${process.env.FRONTEND_BASEURL_INTERNAL}?tfa=false`);
	}
	catch (e)
	{
		return reply.code(500).send({ error: e.message });
	}
}