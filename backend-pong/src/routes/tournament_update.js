import db from "../database/database.js";
import { update_game } from "../utils/games.js";

function get_tournament_data(tournament_id) {
    return db.prepare(`
        SELECT id, configuration_id
        FROM tournaments
        WHERE id = ?
    `).get(tournament_id);
}

function get_current_phase(tournament_id) {
    return db.prepare(`
        SELECT MAX(tg.phase) as max_phase 
        FROM tournament_games tg
        JOIN games g ON tg.game_id = g.id
        WHERE tg.tournament_id = ? AND g.status = 2
    `).get(tournament_id)?.max_phase;
}

function get_max_phase(tournament_id) {
    return db.prepare(`
        SELECT MAX(phase) as max 
        FROM tournament_games 
        WHERE tournament_id = ?
    `).get(tournament_id).max;
}

function get_winners(tournament_id, phase) {
    return db.prepare(`
        SELECT 
            CASE WHEN g.player_a_score > g.player_b_score 
                THEN g.player_a_id 
                ELSE g.player_b_id 
            END as winner
        FROM games g
        JOIN tournament_games tg ON g.id = tg.game_id
        WHERE tg.tournament_id = ? 
          AND tg.phase = ? 
          AND g.status = 2
        ORDER BY tg.ordr
    `).all(tournament_id, phase).map(row => row.winner);
}

function get_next_phase_games(tournament_id, next_phase) {
    return db.prepare(`
        SELECT tg.game_id, tg.ordr 
        FROM tournament_games tg
        WHERE tg.tournament_id = ? AND tg.phase = ?
        ORDER BY tg.ordr
    `).all(tournament_id, next_phase);
}

function is_8_player_tournament(tournament_id) {
    return db.prepare(`
        SELECT COUNT(*) as count 
        FROM tournament_players 
        WHERE tournament_id = ?
    `).get(tournament_id).count === 8;
}

async function update_next_phase(tournament_id, current_phase, winners) {
    const next_phase = current_phase + 1;
    const next_games = get_next_phase_games(tournament_id, next_phase);
    const is_8_player = is_8_player_tournament(tournament_id);

    if (is_8_player) {
        if (current_phase === 1 && winners.length === 4) {
            update_game(next_games[0].game_id, {
                player_a_id: winners[0],
                player_b_id: winners[1],
                state: "Waiting",
                player_a_score: 0,
                player_b_score: 0
            });
            
            update_game(next_games[1].game_id, {
                player_a_id: winners[2],
                player_b_id: winners[3],
                state: "Waiting",
                player_a_score: 0,
                player_b_score: 0
            });
        } 
        else if (current_phase === 2 && winners.length === 2) {
            update_game(next_games[0].game_id, {
                player_a_id: winners[0],
                player_b_id: winners[1],
                state: "Waiting",
                player_a_score: 0,
                player_b_score: 0
            });
        }
    } 
    else if (winners.length === 2) {
        update_game(next_games[0].game_id, {
            player_a_id: winners[0],
            player_b_id: winners[1],
            state: "Waiting",
            player_a_score: 0,
            player_b_score: 0
        });
    }
}

export default async function tournament_update(request, reply) {
    const { id } = request.params;

    const tournament = get_tournament_data(id);
    if (!tournament)
        return reply.code(404).send({ error: 'Tournament not found' });

    const current_phase = get_current_phase(id);
    const max_phase = get_max_phase(id);
    const is_8_player = is_8_player_tournament(id);
    
    if (current_phase === null)
        return reply.code(200).send({ error: 'No completed phases available' });
    
    if (current_phase >= max_phase)
        return reply.code(200).send({ error: 'Tournament already finished' });

    const winners = get_winners(id, current_phase);
    const required_winners = is_8_player ? (current_phase === 1 ? 4 : 2) : 2;

    if (winners.length !== required_winners)
        return reply.code(200).send({ error: `${required_winners} winners required` });

    try {
        update_next_phase(id, current_phase, winners);
        return reply.code(200).send();
    } catch (err) {
        return reply.code(200).send({ error: err });
    }
}