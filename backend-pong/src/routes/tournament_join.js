import db from "../database/database.js";

export default async function tournament_join(request, reply) {
    const { player_id, tournament_id } = request.body;

    try {
        const tournament = db
        .prepare(`SELECT id FROM tournaments WHERE id = ?`)
        .get(tournament_id);


        if (!tournament) {
            return reply.code(404).send({ error: "Tournament not found" });
        }

        const isMember = db
        .prepare(`
            SELECT tournament_id FROM tournament_players
            WHERE player_id = ? AND tournament_id = ?
        `)
        .get(player_id, tournament_id);

        if (!isMember)
            return reply.code(403).send({ error: "Player not in tournament" });

        return reply.code(200).send({ tournament_id });
    } catch (err) {
        return reply.code(500).send({ error: err });
    }
}
