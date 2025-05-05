export default async function (fastify, options)
{
	fastify.get('/', {
		schema: {
			querystring: {
				type: 'object',
				properties: {
					alias: { type: 'string' },
					email: { type: 'string', format: 'email' },
					limit: { type: 'integer', minimum: 1 },
					page: { type: 'integer', minimum: 1 }
				}
			},
			additionalProperties: false
		}
	}, async (request, reply) => { return reply.send({ message: 'Hello from the user route!' }) });
}