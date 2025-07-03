import db from '../database/database.js'

// 2025-07-03 14:52:28
// function get_now_time()
// {
// 	/* Get the time */
// 	const now_time = new Date();
// 	const time_offset = now_time.getTimezoneOffset();
// 	const plus2_time = new Date(now_time.getTime() - time_offset * 60 * 1000);

// 	/* Parse to string ^*/
// 	const number_formatter = (n) => n.toString().padStart(2, '0');
// 	const year = plus2_time.getUTCFullYear();
// 	const month = number_formatter(plus2_time.getUTCMonth() + 1);
// 	const day = number_formatter(plus2_time.getUTCDate());
// 	const hour = number_formatter(plus2_time.getUTCHours());
// 	const minute = number_formatter(plus2_time.getUTCMinutes());
// 	const second = number_formatter(plus2_time.getUTCSeconds());

// 	return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
// }

function get_now_time() {
	const now = new Date();
	const sp = now.toLocaleString('sv-SE', {
		timeZone: 'Europe/Madrid',
		hour12: false
	});
	return sp;
}

export default async function active_user( request, reply )
{
	const { id } = request.params;
	const { token } = request.cookies;

	try
	{
		/* Check if the user exists */
		const user_search = db.prepare("SELECT id FROM users WHERE id = ?").get(id);
		if (!user_search)
			return reply.code(404).send({ error: 'User not found' })

		/* Check if the user is correct */
		const token_check = await fetch(`${process.env.AUTH_API_BASEURL_INTERNAL}/me`, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`
			}
		})
		if (!token_check || !token_check.ok)
			return reply.code(400).send({ error: 'Invalid token' })
		const token_check_json = await token_check.json();
		const auth_id = token_check_json.user_id;
		if (auth_id === undefined || auth_id != id)
			return reply.code(403).send({ error: "You cannot do this in another user's account" })

		/* Set the new date */
		db
			.prepare("UPDATE users SET last_active = ? WHERE id = ?")
			.run(get_now_time(), id);
		
		return reply.code(200).send();
	}
	catch(error)
	{
		return reply.code(500).send({ error })
	}

}