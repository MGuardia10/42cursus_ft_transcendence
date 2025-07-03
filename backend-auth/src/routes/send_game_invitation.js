import { randomBytes } from "crypto";

import db from "../database/database.js";
import { get_jwt } from "../utils/jwt.js";
import { send_mail_invitation } from "../utils/mail_config.js";

export default async function send_game_invitation(request, reply) {
  // Get the parameters
  const { id } = request.body;

  // Check if the user id is provided
  if (!id) {
    return reply.code(400).send({ error: "User ID is required" });
  }

  // Check if the token is valid and extract payload
  const { valid, payload } = get_jwt(request.cookies.token);

  if (!valid) {
    return reply.code(401).send({ error: "Invalid token" });
  }

  // Check is the user ID to invite is not the same as the requester
  if (Number(id) === Number(payload.user_id)) {
    return reply.code(403).send({ error: "You cannot invite yourself" });
  }

  // Get email from the user ID
  const res = await fetch(`${process.env.USER_API_BASEURL_INTERNAL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Check if the response is ok and extract email
  const { name, email } = await res.json();
  if (!name || !email) {
    return reply.code(404).send({ error: "User not found" });
  }

  // Create code and hash for the invitation
  const code = Math.floor(Math.random() * (1000000 - 100000) + 100000);
  const hash = randomBytes(32).toString("hex");

  // Store the invitation in the database
  db.prepare(
    "INSERT INTO invitation_codes (user_id, code, hash) VALUES (?, ?, ?)"
  ).run(id, code, hash);

  // Send notification to user email
  await send_mail_invitation(email, name, code);

  // Send response ok
  return reply.code(200).send({ hash });
}
