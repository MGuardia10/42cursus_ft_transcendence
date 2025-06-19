import game_create from "./game_create.js";
import player_create from "./player_create.js";
import player_delete from "./player_delete.js";
import player_get from "./player_get.js";
import player_modify from "./player_modify.js";

/* This function is used to check if the cookie is present in the request */
function cookieChecker(request, reply, done) {
  if (!request.cookies || typeof request.cookies.token !== 'string')
    return reply.status(400).send({ error: 'The "token" cookie is mandatory' });
  done();
}

export default async function (fastify, options)
{
	fastify.post('/players', {
		schema: {
			body: {
				type: 'object',
				required: ['user_id'],
				properties: {
					user_id: { type: 'integer', minimum: 1 }
				}
			},
			additionalProperties: false
		}
	}, player_create);

	fastify.get('/player/:id', {
		schema: {
			params: {
				required: ['id'],
				properties: {
					id: { type: 'integer' }
				}
			}
		}
	}, player_get);

	fastify.patch('/player/:id', {
		schema: {
			params: {
				required: ['id'],
				properties: {
					id: { type: 'integer' }
				}
			},
			body: {
				type: 'object',
				properties: {
					configuration: { type: 'object' },
					win_count: { type: 'integer', minimum: 1 },
					lose_count: { type: 'integer', minimum: 1 },
					win_points: { type: 'integer', minimum: 1 },
					lose_points: { type: 'integer', minimum: 1 },
				}
			}

		}
	}, player_modify);

	fastify.delete('/player/:id', {
		schema: {
			params: {
				required: ['id'],
				properties: {
					id: { type: 'integer' }
				}
			}
		},
		preValidation: cookieChecker
	}, player_delete);


	/***************/
	/* NOTE: Games */
	/***************/

	fastify.post('/games', {
		schema: {
			body: {
				type: 'object',
				required: ['player_a_id', 'player_b_id'],
				properties: {
					player_a_id: { type: 'string' },
					player_b_id: { type: 'string' },
				}
			}
		}
	}, game_create);

}
