import get_users_by_filters from './get_users_by_filters.js';
import { get_user_by_id, get_user_avatar_by_id } from './get_user_by_id.js';
import get_friends_by_filters from './get_friends_by_filters.js';
import get_friends_by_id from './get_friends_by_id.js';

import add_user from './add_user.js';
import add_friend from './add_friend.js';

export default async function (fastify, options) {
  
  /***********************/
  /* NOTE: GET endpoints */
  /***********************/

  /* Get all the users (just name and id), and some filters */
  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          limit: { type: 'integer', minimum: 1},
          page: { type: 'integer', minimum: 1 }
        }
      },
      additionalProperties: false
    }
  }, get_users_by_filters);

  /* Get the information of an user, providing the id */
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' }
        }
      }
    }
  }, get_user_by_id);

  /* Get an user avatar */
  fastify.get('/:id/avatar', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' }
        }
      }
    }
  }, get_user_avatar_by_id);

  /* Get all the friend relationships */
  fastify.get('/friends', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          limit: { type: 'integer', minimum: 1 },
          page: { type: 'integer', minimum: 1 }
        },
        additionalProperties: false
      }
    }
  }, get_friends_by_filters);

  fastify.get('/friends/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string' }
        },
        additionalProperties: false
      }
    }
  }, get_friends_by_id)

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
