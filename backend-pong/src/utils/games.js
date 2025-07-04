import db from "../database/database.js"

/*********************************************************************/

function create_game( id_a, id_b )
{
	/* Execute the insertion */
	const result = db
		.prepare("INSERT INTO games(player_a_id, player_b_id) VALUES(?,?)")
		.run(id_a, id_b);

	/* Return the created row id */
	return result.lastInsertRowid;
}

/*********************************************************************/

function format_game_data( data )
{
	function get_state_name( id )
	{
		const search = db.prepare("SELECT name FROM game_status WHERE id = ?").get(id);
		return search ? search.name : undefined
	}

	return {
		id: data.id,
		status: get_state_name(data.status),
		date: data.date,
		player_a_id: data.player_a_id,
		player_a_score: data.player_a_score,
		player_b_id: data.player_b_id,
		player_b_score: data.player_b_score,
	}
}

/*********************************************************************/

function check_win( score_a, score_b )
{
	return score_a > score_b
		? 1
		: score_b > score_a
			? 2
			: 0 
}

function calculate_win_diff( old_win, current_win )
{
	let games_a_diff = 0;
	let games_b_diff = 0;

	/* Check no result change */
	if ( old_win == current_win )
		return { games_a_diff, games_b_diff };
	
	/* Check all the cases cases */
	if (old_win == 0)
	{
		if (current_win == 1)
			games_a_diff = 1;
		else
			games_b_diff = 1;
	}
	
	if (old_win == 1)
	{
		games_a_diff = -1
		if (current_win == 2)
			games_b_diff = 1
	}

	if (old_win == 2)
	{
		games_b_diff = -1;
		if (current_win == 1)
			games_a_diff = 1;
	}

	/* Return the diffs */
	return { games_a_diff, games_b_diff };
}

function set_game_data( id, field, value )
{
	db.prepare(`UPDATE games SET ${field} = ? WHERE id = ?`).run( value, id );
}

function set_game_punctuation( game_id, player_a_score, player_b_score )
{
	function get_player_data( player )
	{
		const field = `${player}_id`
		const player_id = db
			.prepare(`SELECT ${field} FROM games WHERE id = ?`)
			.get(game_id)[field];
		const player_scores = db
			.prepare(`SELECT win_count, lose_count, win_points, lose_points FROM players WHERE id = ?`)
			.get(player_id)
		
		return {player_id, player_scores};
	}

	/* Get the players ids and the global punctuation */
	const player_a_data = get_player_data('player_a');
	const { player_id: player_a_id } = player_a_data;
	const player_b_data = get_player_data('player_b')
	const { player_id: player_b_id } = player_b_data;

	/* Get the old game results */
	const current_score = db
		.prepare("SELECT player_a_score, player_b_score FROM games WHERE id = ?")
		.get(game_id)
	const { player_a_score: old_player_a_score, player_b_score: old_player_b_score } = current_score;
	const player_a_diff = player_a_score - old_player_a_score;
	const player_b_diff = player_b_score - old_player_b_score;

	/* Update the players points*/
	db
		.prepare("UPDATE players SET win_points = ?, lose_points = ? WHERE id = ?")
		.run(
			player_a_data.player_scores.win_points + player_a_diff,
			player_a_data.player_scores.lose_points + player_b_diff,
			player_a_id
		);
	db
		.prepare("UPDATE players SET win_points = ?, lose_points = ? WHERE id = ?")
		.run(
			player_b_data.player_scores.win_points + player_b_diff,
			player_b_data.player_scores.lose_points + player_a_diff,
			player_b_id
		);

	/* Update the players wins/loses */
	const who_was_winning = check_win(old_player_a_score, old_player_b_score);
	const who_is_winning = check_win(player_a_score, player_b_score);
	const { games_a_diff, games_b_diff } = calculate_win_diff( who_was_winning, who_is_winning );

	db
		.prepare("UPDATE players SET win_count = ?, lose_count = ? WHERE id = ?")
		.run(
			player_a_data.player_scores.win_count + games_a_diff,
			player_a_data.player_scores.lose_count + games_b_diff,
			player_a_id
		)
	db
		.prepare("UPDATE players SET win_count = ?, lose_count = ? WHERE id = ?")
		.run(
			player_b_data.player_scores.win_count + games_b_diff,
			player_b_data.player_scores.lose_count + games_a_diff,
			player_b_id
		)


	/* Update the match info */
	set_game_data( game_id, 'player_a_score', player_a_score );
	set_game_data( game_id, 'player_b_score', player_b_score );
}

function update_game( id, data )
{
	/* Get all the info */
	const { player_a_id, player_b_id, player_a_score, player_b_score, state } = data;

	/* Update each field */
	if (player_a_score !== undefined && player_b_score !== undefined)
		set_game_punctuation( id, player_a_score, player_b_score );

	if (player_a_id !== undefined)
		set_game_data( id, "player_a_id", player_a_id );
	if (player_b_id !== undefined)
		set_game_data( id, "player_b_id", player_b_id );

	if (state !== undefined)
	{
		const search_state = db
			.prepare("SELECT id FROM game_status WHERE name = ?")
			.get(state).id;
		if (search_state === undefined)
			return false;
		set_game_data( id, "status", search_state );
	}

	return true;
}

export { create_game, format_game_data, update_game };
