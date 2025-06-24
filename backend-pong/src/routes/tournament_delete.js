import db from "../database/database.js";

export default async function tournament_delete(request, reply) {
	const { id } = request.params;

	try {
		const tournament = db.prepare("SELECT id FROM tournaments WHERE id = ?").get(id);
		if (!tournament)
			return reply.code(404).send({ error: "Tournament not found" });
		db.prepare("DELETE FROM tournaments WHERE id = ?").run(id);

		return reply.code(200).send({ message: "Tournament deleted successfully" });
	} catch (err) {
        console.error(err);
		return reply.code(500).send({ error: "Error deleting tournament" });
	}
}