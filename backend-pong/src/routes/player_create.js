import { create_configuration } from '../utils/configuration.js'
import db from '../database/database.js';

export default async function player_create(req, reply)
{
	const { user_id } = req.body;

	try
	{
		/* Check if the user exists */
		const search = db.prepare("SELECT id FROM players WHERE id = ?").get(user_id);
		if (search)
			return reply.code(409).send({ error: `The user with id ${user_id} exists` });

		/* Create the configuration */
		console.log({
			default_conf: true,
			ptw: process.env.POINTS_TO_WIN,
			sd: process.env.SERVE_DELAY,
			fc: process.env.FIELD_COLOR,
			bc: process.env.BALL_COLOR,
			sc: process.env.STICK_COLOR
		})

		const conf_id = create_configuration({
			default_conf: true,
			ptw: process.env.POINTS_TO_WIN,
			sd: process.env.SERVE_DELAY,
			fc: process.env.FIELD_COLOR,
			bc: process.env.BALL_COLOR,
			sc: process.env.STICK_COLOR
		});
		if (conf_id === undefined)
			return reply.code(500).send({ error: "Error creating the player configuration" });

		/* Save the player */
		const user_added = db
			.prepare("INSERT INTO players(id, configuration_id) VALUES(?, ?)")
			.run(user_id, conf_id);
		
		return reply.code(201).send({ user_id: user_id });
	}
	catch(err)
	{
		return reply.code(500).send({ error: "The user couldn't be created" });
	}
}
