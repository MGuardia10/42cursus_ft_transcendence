import get_users from './get_users.js';

import add_user from './add_user.js';
import add_friend from './add_friend.js';

export default async function (fastify, options) {
  
  /***********************/
  /* NOTE: GET endpoints */
  /***********************/

  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          limit: { type: 'integer' },
          page: { type: 'integer' }
        }
      }
    }
  }, get_users);


  /************************/
  /* NOTE: POST endpoints */
  /************************/

  /* Endpoint to add users */
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email', 'avatar_url'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          avatar_url: { type: 'string', format: 'uri' }
        }
      }
    }
  }, add_user);

  /* Endpoint to stablishe a connection between users */
  fastify.post('/friend', {
    schema: {
      body: {
        type: 'object',
        required: ['from', 'to'],
        properties: {
          from: { type: 'integer' },
          to: { type: 'integer' }
        }
      }
    }
  }, add_friend);
};
