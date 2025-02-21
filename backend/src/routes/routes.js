import help from './help.js'
import get_users from './users.js'

export default async function (fastify, options) {
  fastify.get('/help', help);
  fastify.get("/users", get_users);
};
