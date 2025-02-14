import help from './help.js'

export default async function (fastify, options) {
  fastify.get('/help', help);
};
