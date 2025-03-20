import google_callback from './google_callback.js';

export default async function (fastify, options) {
  fastify.get(process.env.GOOGLE_CALLBACK_ENDPOINT, google_callback);
};
