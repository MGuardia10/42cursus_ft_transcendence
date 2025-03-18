import login_endpoint from "./login.js";

export default async function (fastify, options) {
  
  /* Login endpoint */
  fastify.get('/login', login_endpoint);
};
