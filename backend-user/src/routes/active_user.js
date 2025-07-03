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

	try
	{
		/* Check if the user exists */
		const user_search = db.prepare("SELECT id FROM users WHERE id = ?").get(id);
		if (!user_search)
			return reply.code(404).send({ error: 'User not found' })

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