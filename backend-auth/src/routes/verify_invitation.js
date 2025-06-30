import db from "../database/database.js";

export default async function verify_invitation(request, reply) {
  // Get the parameters
  const { code, hash } = request.body;
  console.log(`2FA validation attempt for hash: ${hash}`);

  // Check if the code and hash are provided
  if (!code || !hash) {
    return reply.code(400).send({ error: "Code and hash are required" });
  }

  // Check if the code is valid
  const hash_data = db
    .prepare("SELECT user_id, code, tries FROM invitation_codes WHERE hash = ?")
    .get(hash);

  // If no hash found, return error
  if (!hash_data) {
    return reply.code(404).send({ error: "Invalid hash" });
  }

  // Extract the user ID, code, and tries from the hash data
  const { user_id, code: db_code, tries } = hash_data;

  // Case incorrect code
  if (db_code !== code) {
    // If the code does not match, decrement tries and check if it reached zero
    if (tries > 1) {
      db.prepare(
        "UPDATE invitation_codes SET tries = tries - 1 WHERE hash = ?"
      ).run(hash);
      return reply.code(401).send({ error: "Incorrect code" });
    } else {
      // If no tries left, delete the hash and return error
      db.prepare("DELETE FROM invitation_codes WHERE hash = ?").run(hash);
      return reply
        .code(429)
        .send({ error: "The maximum number of attempts has been reached" });
    }
  }

  // Case correct code
  db.prepare("DELETE FROM invitation_codes WHERE hash = ?").run(hash);

  // Return the user ID associated with the code
  return reply.code(200).send({ user_id });
}
