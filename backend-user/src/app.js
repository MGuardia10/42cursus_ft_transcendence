/* fastify */
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs';
import multipart from '@fastify/multipart';
import cookie from '@fastify/cookie';

/* Database */
import {initializeDB} from './database/database.js';

/* Local files */
import routes from './routes/routes.js';

/* NOTE: Create the server object */
const app = Fastify({ logger: true });

/* NOTE: Register the valid methods and IPs */
app.register(cors, {
  origin: process.env.FRONTEND_BASEURL_EXTERNAL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});

/* NOTE: Register the multipart plugin */
app.register(multipart);

/* NOTE: Register the cookie plugin */
app.register(cookie);

/* NOTE: Init the database */
await initializeDB();

/* NOTE: Register the routes */
app.register(routes);

/* NOTE: Check if the avatars folder exists */
const avatar_folder = process.env.AVATAR_FOLDER;
if (!fs.existsSync(avatar_folder))
  fs.mkdirSync(avatar_folder);

/* NOTE: Start the server */
const start = async () => {
  try {
    console.log('Starting server...');
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();  