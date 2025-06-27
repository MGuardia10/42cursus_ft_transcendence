import db from "../database/database.js";

export default async function tournament_delete(request, reply) {
    const { id } = request.params;

    try {
        const tournamentExists = db.prepare(`
            SELECT id FROM tournaments WHERE id = ?
        `).get(id);
       
        if (!tournamentExists)
            return reply.code(404).send({ error: "Tournament not found" });

        db.prepare(`
            DELETE FROM configuration WHERE id = ?
        `).run(tournament.configuration_id);

        db.prepare(`
            UPDATE tournaments SET active = ? WHERE id = ?
        `).run(0, id);

        return reply.code(200).send();
    } catch (err) {
        return reply.code(500).send({ error: err });
    }
}