import url from 'url';
import { oauth2client } from '../google_oauth.js';

export default async function google_callback(request, reply)
{
	/* Parse the link, divide it into parts */
	console.log("Request: ", request.url)
	let q = url.parse(request.url, true).query;
	if (q.error)
		return reply.code(500).send(q.error);

	/* Get the tokens and send a request to get the info */
	let { tokens } = oauth2client.getToken(q.code);
	oauth2client.setCredentials(tokens);
	await fetch (`https://www.googleapis.com/oauth2/v3/userinfo`, {
		headers: {
			'Authorization': `Bearer ${tokens.access_token}`,
		}
	})
		.then(response => response.json())
		.then(data => {
			console.log("Token data: ", data)
		})

	return reply.redirect('https://localhost:8080');
}