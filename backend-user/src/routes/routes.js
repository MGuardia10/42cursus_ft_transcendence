import help from './help.js'
import {add_user, get_users} from './users.js'

export default async function (fastify, options) {
  fastify.get('/help', help);
  fastify.get("/users", get_users);

  fastify.post('/users', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' }
        }
      }
    }
  }, add_user)
};
