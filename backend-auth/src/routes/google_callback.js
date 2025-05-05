import url from 'url';
import { oauth2client } from '../utils/google_oauth.js';
import { create_jwt } from '../utils/jwt.js';
import db from '../database/database.js';
import { randomBytes } from 'crypto';
import send_mail from '../utils/mail_config.js';

async function create_user(baseurl, name, email, avatar_url)
{
	const data = await fetch (`${baseurl}/`, {
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
	
	const { id, language } = await data.json();

	return { user_id: id, user_name: name, user_email: email, language: language, tfa: false };
}

async function search_user(baseurl, user_id)
{
	const data = await fetch (`${baseurl}/${user_id}`, {
		method: "GET"
	});
	const { name, email, language, tfa } = await data.json();
	const response = tfa == 0 ? false : true;
	return { user_id: user_id, user_name: name, user_email: email, language: language, tfa: response };
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
		: search_user(users_api, users_found[0].id);
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
		const { user_id, user_name, user_email, language, tfa } = await manage_user(users_api, name, email, picture);
		
		/* Check if the user has TFA enabled */
		if (tfa == false) {
			/* Create the user init token and return it */
			const token = create_jwt({
				user_id: user_id,
				language: language
			});

			/* Set the cookie and redirect */
			return reply
				.setCookie('token', token, {
					sameSite: 'None',
					secure: true,
					httpOnly: true,
					path: '/',
					expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
				})
				.redirect(`${process.env.FRONTEND_BASEURL_EXTERNAL}`);
		}
		
		/* TFA activated: Register a new code and a hash */
		const code = Math.floor(Math.random() * (1000000 - 100000) + 100000);
		const hash = randomBytes(32).toString('hex');
		db.prepare("INSERT INTO tfa_codes(hash, user_id, language, code) VALUES(?, ?, ?, ?)").run(hash, user_id, language, code);

		/* Send the mail */
		await send_mail(user_email, user_name, code);

		/* Redirect with tfa true and the temporal code */
		return reply.redirect(`${process.env.FRONTEND_BASEURL_EXTERNAL}/login/tfa?hash=${hash}`);
	}
	catch (e)
	{
		return reply.code(500).send({ error: e.message });
	}
}