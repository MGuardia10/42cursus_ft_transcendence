import db from "../database/database.js";

export default async function tournament_delete(request, reply) {
    const { id } = request.params;
    
    try {
        db.prepare("PRAGMA foreign_keys = ON").run();
        
        const games = db.prepare(`
            SELECT game_id FROM tournament_games WHERE tournament_id = ?
        `).all(id);
        
        db.prepare("DELETE FROM tournament_players WHERE tournament_id = ?").run(id);
        db.prepare("DELETE FROM tournament_games WHERE tournament_id = ?").run(id);
        db.prepare("DELETE FROM tournaments WHERE id = ?").run(id);
        
        const tournament = db.prepare(`
            SELECT configuration_id FROM tournaments WHERE id = ?
        `).get(id);
        
        if (tournament)
            db.prepare("DELETE FROM configuration WHERE id = ?").run(tournament.configuration_id);

        return reply.code(200).send();
        
    } catch (err) {
        return reply.code(500).send({ error: err });
    }
}