import help from './help.js'
import {add_user, get_users} from './users.js'

export default async function (fastify, options) {
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
