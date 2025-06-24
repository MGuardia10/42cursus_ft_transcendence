import db from '../database/database.js'
import { create_game } from './games.js'

function get_current_phase(tournament_id)
{
	try
	{
		const result = db
			.prepare("SELECT MAX(phase) AS phase FROM tournament_games WHERE tournament_id = ?")
			.get(tournament_id);
		return result?.phase ?? null;
	}
	catch (err)
	{
		return null;
	}
}

function get_tournament_games_by_phase(tournament_id, phase)
{
	try
	{
		const result = db
			.prepare(`SELECT games.* FROM tournament_games
					  JOIN games ON games.id = tournament_games.game_id
					  WHERE tournament_games.tournament_id = ? AND tournament_games.phase = ?`)
			.all(tournament_id, phase);
		return result;
	}
	catch (err)
	{
		return [];
	}
}

function get_winner(game)
{
	if (game.player_a_score > game.player_b_score)
		return game.player_a_id;
	if (game.player_b_score > game.player_a_score)
		return game.player_b_id;
	return null;
}

function update_tournament(tournament_id)
{
	const current_phase = get_current_phase(tournament_id);
	if (current_phase === null)
		return false;

	const current_games = get_tournament_games_by_phase(tournament_id, current_phase);
	if (current_games.length === 0)
		return false;

	const all_finished = current_games.every(game => game.status === 2);
	if (!all_finished)
		return false;

	const winners = current_games.map(get_winner).filter(winner => winner !== null);
	if (winners.length < 2)
		return false;

	const next_phase = current_phase + 1;
	let order = 1;

	try
	{
		for (let i = 0; i < winners.length; i += 2)
		{
			if (i + 1 >= winners.length)
				break;

			const game_id = create_game(winners[i], winners[i + 1]);
			db
				.prepare("INSERT INTO tournament_games (tournament_id, game_id, phase, ordr) VALUES (?, ?, ?, ?)")
				.run(tournament_id, game_id, next_phase, order++);
		}
		return true;
	}
	catch (err)
	{
		return false;
	}
}

export { update_tournament };