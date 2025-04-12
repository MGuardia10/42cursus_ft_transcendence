import google_callback from './google_callback.js';
import google_login from './google_login.js';

export default async function (fastify, options) {
  fastify.get('/login', google_login);
  fastify.get(process.env.GOOGLE_CALLBACK_ENDPOINT, google_callback);
};
