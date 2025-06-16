import player_create from "./player_create.js";
import player_get from "./player_get.js";
import player_modify from "./player_modify.js";

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
}
