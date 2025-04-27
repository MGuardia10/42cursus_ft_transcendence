import google_callback from './google_callback.js';
import google_login from './google_login.js';
import logout from './logout.js';
import me from './me.js';
import update from './update.js';
import tfa from './tfa.js';

/* This function is used to check if the cookie is present in the request */
function cookieChecker(request, reply, done) {
  if (!request.cookies || typeof request.cookies.token !== 'string')
    return reply.status(400).send({ error: 'The "token" cookie is mandatory' });
  done();
}

export default async function (fastify, options) {
  /* Endpoint to init the login with google */
  fastify.get('/login', google_login);

  /* Endpoint that will be called by google after the user has logged in */
  fastify.get(process.env.GOOGLE_CALLBACK_ENDPOINT, google_callback);

  /* Endpoint to logout */
  fastify.get('/logout',{
    preValidation: cookieChecker
  }, logout);

  /* Endpoint to get the information about a token */
  fastify.get('/me', {
    preValidation: cookieChecker
  }, me);

  /* Endpoint to update the user information */
  fastify.post('/update', {
    schema: {
      body: {
        type: 'object',
        required: ['language'],
        properties: {
          language: { type: 'string' }
        }
      }
    },
    preValidation: cookieChecker
  }
  , update);

  /* TFA route, where the user temp hash and code are sent to be validated */
  fastify.post('/tfa',{
    schema: {
      body: {
        type: 'object',
        required: ['hash', 'code'],
        properties: {
          hash: { type: 'string' },
          code: { type: 'integer' }
        }
      }
    }
  }, tfa);
};
