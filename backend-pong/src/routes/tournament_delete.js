import db from "../database/database.js";

export default async function tournament_delete(request, reply) {
    const { id } = request.params;
    
    try {
        const tournament = db.prepare(`
            SELECT id FROM tournaments WHERE id = ?
        `).get(id);
        
        if (!tournament)
            return reply.code(404).send({ error: 'Tournament not found' });

        db.prepare("DELETE FROM tournament_players WHERE tournament_id = ?").run(id);
        db.prepare("DELETE FROM tournament_games WHERE tournament_id = ?").run(id);
        
        const config_id = db.prepare(`
            SELECT configuration_id FROM tournaments WHERE id = ?
        `).get(id)?.configuration_id;
        
        if (config_id)
            db.prepare("DELETE FROM configuration WHERE id = ?").run(config_id);

        db.prepare("DELETE FROM tournaments WHERE id = ?").run(id);

        return reply.code(200).send();
        
    } catch (err) {
        return reply.code(500).send({ error: err });
    }
}