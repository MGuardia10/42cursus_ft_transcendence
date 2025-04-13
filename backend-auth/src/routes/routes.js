import google_callback from './google_callback.js';
import google_login from './google_login.js';
import logout from './logout.js';
import me from './me.js';
import update from './update.js';

export default async function (fastify, options) {
  /* Endpoint to init the login with google */
  fastify.get('/login', google_login);

  /* Endpoint that will be called by google after the user has logged in */
  fastify.get(process.env.GOOGLE_CALLBACK_ENDPOINT, google_callback);

  /* Endpoint to logout */
  fastify.get('/logout',{
    schema: {
      headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
          authorization: { type: 'string' }
        }
      }
    }
  }, logout);

  /* Endpoint to get the information about a token */
  fastify.get('/me', {
    schema: {
      headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
          authorization: { type: 'string' }
        }
      }
    }
  }, me);

  /* Endpoint to update the user information */
  fastify.post('/update', {
    schema: {
      headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
          authorization: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['language'],
        properties: {
          language: { type: 'string' }
        }
      }
    }
  }
  , update);
};
