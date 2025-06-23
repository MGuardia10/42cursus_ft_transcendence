import db from "../database/database.js";

function get_tournament_data(tournament_id) {
	return db.prepare(`
		SELECT id, configuration_id
		FROM tournaments
		WHERE id = ?
	`).get(tournament_id);
}

function get_tournament_configuration(config_id) {
	return db.prepare(`
		SELECT
			default_value,
			points_to_win,
			serve_delay,
			ball_color,
			stick_color,
			field_color
		FROM configuration
		WHERE id = ?
	`).get(config_id);
}

function get_tournament_players(tournament_id) {
	return db.prepare(`
		SELECT player_id
		FROM tournament_players
		WHERE tournament_id = ?
	`).all(tournament_id).map(p => p.player_id);
}

function get_tournament_games(tournament_id) {
	return db.prepare(`
		SELECT games.*
		FROM games
		JOIN tournament_games ON tournament_games.game_id = games.id
		WHERE tournament_games.tournament_id = ?
	`).all(tournament_id);
}

function merge_tournament_data(tournament_id, config, players, games) {
	return {
		configuracion: {
			tournament_id,
			default_value: config.default_value === 1,
			points_to_win: config.points_to_win,
			serve_delay: config.serve_delay,
			ball_color: config.ball_color,
			stick_color: config.stick_color,
			field_color: config.field_color
		},
		players,
		games
	};
}

export default async function tournament_get(request, reply) {
	const { id } = request.params;

	const tournament = get_tournament_data(id);
	if (!tournament)
		return reply.code(404).send({ error: 'Tournament not found' });

	const config = get_tournament_configuration(tournament.configuration_id);
	if (!config)
		return reply.code(404).send({ error: 'Tournament configuration not found' });

	const players = get_tournament_players(id);
	const games = get_tournament_games(id);

	const result = merge_tournament_data(id, config, players, games);
	return reply.code(200).send(result);
}