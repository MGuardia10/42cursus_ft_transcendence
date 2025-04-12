import url from 'url';
import { oauth2client } from '../google_oauth.js';

async function create_user(baseurl, name, email, avatar_url)
{
	await fetch (`${baseurl}/`, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			email,
			avatar_url
		})
	})
}

export default async function google_callback(request, reply)
{
	/* Parse the link, divide it into parts */
	let q = url.parse(request.url, true).query;
	if (q.error)
		return reply.code(500).send(q.error);

	/* Get the tokens and send a request to get the info */
	let { tokens } = await oauth2client.getToken(q.code);
	oauth2client.setCredentials(tokens);

	let google_response;
	try {
		google_response = await fetch (`https://www.googleapis.com/oauth2/v3/userinfo`, {
			headers: {
				'Authorization': `Bearer ${tokens.access_token}`,
			}
		})
	}
	catch(e)
	{
		return reply.code(500).send(`Error while fetching to google: ${e}`)
	}

	/* Check if the user is registered */
	const { name, email, picture } = await google_response.json();
	const users_api = process.env.USER_API_BASEURL_INTERNAL;

	try {
		/* Get the list */
		const users_response = await fetch (
			`${users_api}/?email=${email}`
		)
		const users_found = await users_response.json()
		console.log("Users found: ", users_found)

		/* Take action taking acoount if the user exists */
		if (users_found.length == 0)
			create_user(users_api, name, email, picture)
	}
	catch (e)
	{
		return reply.code(500).send(`Error fetching the user API: ${e}`)
	}



	return reply.redirect('https://localhost:8080');
}