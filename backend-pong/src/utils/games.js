import db from "../database/database.js"

function create_game( id_a, id_b )
{
	/* Execute the insertion */
	const result = db
		.prepare("INSERT INTO games(player_a_id, player_b_id) VALUES(?,?)")
		.run(id_a, id_b);

	/* Return the created row id */
	return result.lastInsertRowid;
}

function get_game_data( id )
{
	const game_data = db
		.prepare("SELECT * from games WHERE id = ?")
		.get( id );
	
	return game_data;
}

function update_game( id, data )
{
	function set_game_data( field, value )
	{
		db.prepare(`UPDATE games SET ${field} = ? WHERE id = ?`).run( value, id);
	}

	/* Get all the info */
	const { player_a_id, player_a_score, player_b_id, player_b_score, state } = data;

	/* Update each field */
	if (player_a_id !== undefined)
		set_game_data( "player_a_id", player_a_id );
	if (player_a_score !== undefined)
		set_game_data( "player_a_score", player_a_score );
	if (player_b_id !== undefined)
		set_game_data( "player_b_id", player_b_id );
	if (player_b_score !== undefined)
		set_game_data( "player_b_score", player_b_score );

	if (state !== undefined)
	{
		const search_state = db
			.prepare("SELECT id FROM game_status WHERE name = ?")
			.get(state);
		if (search_state === undefined)
			return false;
		update_game( "status", search_state );
	}

	return true;
}

export { create_game };
