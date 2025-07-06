import { create_configuration } from "../utils/configuration.js";
import db from "../database/database.js";
import { randomBytes } from "crypto";
import { create_game } from "../utils/games.js";

function divide_players(players) {
  if (players.length != 4) return undefined;

  const random_index = Math.floor(Math.random() * 3) + 1;
  const m1 = [players[0], players[random_index]];
  const m2 = players.filter((num) => !m1.includes(num));
  return [m1, m2];
}

function matchmaking_4(tournament_id, players, base_phase = 1, base_ordr = 1) {
  /* Get the matches */
  const matches = [...divide_players(players), [-1, -1]];

  /* Create each match and the next rounds */
  let ordr = base_ordr - 1;
  matches.forEach(([p1, p2]) => {
    const game_id = create_game(p1, p2);
    const current_phase = p1 != -1 ? base_phase : base_phase + 1;
    const current_ordr =
      current_phase === base_phase
        ? (ordr % (base_ordr + 1)) + 1
        : (base_ordr - 1) / 2 + 1;
    db.prepare(
      "INSERT INTO tournament_games(tournament_id, game_id, phase, ordr) VALUES(?, ?, ?, ?)"
    ).run(tournament_id, game_id, current_phase, current_ordr);
    ordr++;
  });
}

function matchmaking_8(tournament_id, players) {
  /* "Create" 2 4 players tournament */
  matchmaking_4(tournament_id, players.slice(0, 4), 1, 1);
  matchmaking_4(tournament_id, players.slice(4, 8), 1, 3);

  /* Set the final match */
  const game_id = create_game(-1, -1);
  db.prepare(
    "INSERT INTO tournament_games(tournament_id, game_id, phase, ordr) VALUES(?, ?, ?, ?)"
  ).run(tournament_id, game_id, 3, 1);
}

function do_matchmaking(tournament_id, players) {
  if (players.length == 4) matchmaking_4(tournament_id, players);
  if (players.length == 8) matchmaking_8(tournament_id, players);
}

export default async function tournament_create(request, reply) {
  /* Get the configuration and the players */
  const { configuration, players } = request.body;

  /* Check if the number of players is valid */
  if (players.length != 4 && players.length != 8)
    return reply.code(400).send({ error: "Incorrect number of players" });

  /* Create the configuration */
  const conf_id = create_configuration({
    default_conf: configuration.default_value,
    ptw: configuration.points_to_win,
    sd: configuration.serve_delay,
    fc: configuration.field_color,
    bc: configuration.ball_color,
    sc: configuration.stick_color,
  });
  if (conf_id == undefined)
    return reply
      .code(400)
      .send({ error: "Error creating the tournament configuration" });

  try {
    /* Create the tournament */
    const tournament_id = randomBytes(4).toString("hex").toUpperCase();
    db.prepare(
      "INSERT INTO tournaments(id, configuration_id) VALUES(?, ?)"
    ).run(tournament_id, conf_id);

    /* Add the specified players */
    players.forEach((player_id) => {
      db.prepare(
        "INSERT INTO tournament_players(tournament_id, player_id) VALUES(?, ?)"
      ).run(tournament_id, player_id);
    });

    /* Create the matchmaking */
    do_matchmaking(tournament_id, players);
    return reply.code(200).send({ tournament_id });
  } catch (err) {
    return reply.code(500).send({ error: err });
  }
}
