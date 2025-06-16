import { REPL_MODE_STRICT } from "repl";
import db from "../database/database.js";

function get_player_stats( player_id )
{
	return db
		.prepare(`
			SELECT
				active,
				configuration_id,
				win_count,
				lose_count,
				win_points,
				lose_points
			FROM players WHERE id = ?`)
		.get(player_id);
}

function get_player_configuration( conf_id )
{
	return db
		.prepare(`
			SELECT
				default_value,
				points_to_win,
				serve_delay,
				ball_color,
				stick_color,
				field_color
			FROM configuration WHERE id = ?`)
		.get(conf_id);
}

function merge_player_data( stats, config )
{
	return {
		id: stats.id,
		active: stats.active,
		configuration: config,
		win_count: stats.win_count,
		lose_count: stats.lose_count,
		win_points: stats.win_points,
		lose_points: stats.lose_points,
	}
}

export default async function player_get( request, reply )
{
	/* Get the player id */
	const { id } = request.params;

	/* Search the player in the database */
	const player_stats = get_player_stats( id );
	if (!player_stats)
		return reply.code(404).send({ error: 'Player not found' });

	/* Get the configuration data */
	const player_conf = get_player_configuration( player_stats.configuration_id );
	if (!player_conf)
		return reply.code(404).send({ error: 'Player configuration not found' });

	/* Merge all the data */
	return reply.code(200).send(merge_player_data( player_stats, player_conf ));
}
