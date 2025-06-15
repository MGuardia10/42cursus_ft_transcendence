import player_create from "./player_create.js";
import player_get from "./player_get.js";

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
				type: 'object',
				required: ['id'],
				properties: {
					id: { type: 'integer' }
				}
			}
		}
	}
	, player_get);
}
