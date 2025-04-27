import { oauth2client, scopes } from '../utils/google_oauth.js';
import { randomBytes } from 'crypto';

export default async function google_login(request, reply)
{
	const state = randomBytes(32).toString('hex');

	const authorizarionUrl = oauth2client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes,
		include_granted_scopes: false,
		state: state
	});

	return reply.redirect(authorizarionUrl);
}