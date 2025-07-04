import db from "../database/database.js";

function generic_change( id, table, field, value )
{
	db
		.prepare(`UPDATE ${table} SET ${field} = ? WHERE id = ?`)
		.run(value, id);
}

function update_stats( player_id, win_count, lose_count, win_points, lose_points )
{
	/* Check what value has to be extracted */
	if (win_count !== undefined)
		generic_change( player_id, 'players', 'win_count', win_count );
	if (lose_count !== undefined)
		generic_change( player_id, 'players', 'lose_count', lose_count );
	if (win_points !== undefined)
		generic_change( player_id, 'players', 'win_points', win_points );
	if (lose_points !== undefined)
		generic_change( player_id, 'players', 'lose_points', lose_points );
}

function update_configuration( player_id, config )
{
	if (!config)
		return undefined

	/* Extract the data and search the conf id */
	const { default_value, points_to_win, serve_delay, ball_color, stick_color, field_color } = config;
	const player_search = db.prepare("SELECT configuration_id FROM players WHERE id = ?").get(player_id);
	if (player_search === undefined)
		return undefined;
	const { configuration_id } = player_search

	/* Make the changes */
	if (default_value !== undefined)
		generic_change( configuration_id, 'configuration', 'default_value', default_value ? 1 : 0);
	if (points_to_win !== undefined)
		generic_change( configuration_id, 'configuration', 'points_to_win', points_to_win);
	if (serve_delay !== undefined)
		generic_change( configuration_id, 'configuration', 'serve_delay', serve_delay);
	if (ball_color !== undefined)
		generic_change( configuration_id, 'configuration', 'ball_color', ball_color);
	if (stick_color !== undefined)
		generic_change( configuration_id, 'configuration', 'stick_color', stick_color);
	if (field_color !== undefined)
		generic_change( configuration_id, 'configuration', 'field_color', field_color);

}

export default async function player_modify( request, reply )
{
	const { id } = request.params;

	const { configuration, win_count, lose_count, win_points, lose_points } = request.body;

	// Permitir solo si viene de un script especial (cabecera secreta)
	const isAdmin = request.headers["x-admin-secret"] === process.env.ADMIN_SECRET;

	// Si no es admin y se intenta modificar stats, rechazar
	if (!isAdmin && (win_count !== undefined || lose_count !== undefined || win_points !== undefined || lose_points !== undefined)) {
		return reply.code(403).send({ error: "No está permitido modificar win_count, lose_count, win_points o lose_points desde el frontend." })
	}

	try
	{
		update_stats( id, win_count, lose_count, win_points, lose_points );
		update_configuration( id, configuration );
		return reply.code(200).send();
	}
	catch(err)
	{
		return reply.code(500).send({ error: err.message || err })
	}
}