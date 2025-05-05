import get_users_by_filters from './get_users_by_filters.js';
import { get_user_by_id, get_user_avatar_by_id } from './get_user_by_id.js';
import get_friends_by_filters from './get_friends_by_filters.js';
import get_friends_by_id from './get_friends_by_id.js';

import add_user from './add_user.js';
import add_friend from './add_friend.js';

import { update_user_data_by_id, update_user_avatar_by_id } from './update_user_by_id.js';

import delete_user_by_id from './delete_user_by_id.js';
import delete_friends from './delete_friends.js';

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
          alias: { type: 'string' },
          email: { type: 'string', format: 'email' },
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

  /* Get the friend relationships of an user, by ID */
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
  }, get_friends_by_id);

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

  /***********************/
  /* NOTE: PUT endpoints */
  /***********************/

  fastify.put('/:id/avatar', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' }
        }
      },
    }
  }, update_user_avatar_by_id);

  /*************************/
  /* NOTE: PATCH endpoints */
  /*************************/

  fastify.patch('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' }
        }
      },
      body: {
        type: 'object',
        properties: {
          alias: { type: 'string' },
          language: { type: 'string' },
          tfa: { type: 'boolean' }
        }
      }
    }
  }, update_user_data_by_id);

  /**************************/
  /* NOTE: DELETE endpoints */
  /**************************/
  fastify.delete('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' }
        }
      }
    }
  }, delete_user_by_id);

  fastify.delete('/friends', {
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
  }, delete_friends);
};
