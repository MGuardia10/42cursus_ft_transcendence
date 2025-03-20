/* fastify */
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyOauth2 from '@fastify/oauth2';

/* Local files */
import routes from './routes/routes.js';

/* NOTE: Create the server object */
const app = Fastify({ logger: true });

/* NOTE: Register the valid methods and IPs */
app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});

/* NOTE: Register the OAuth2 config */
app.register(fastifyOauth2, {
  name: 'googleOAuth2',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/login',
  callbackUri: process.env.GOOGLE_CALLBACK_URI,
});


/* NOTE: Register the routes */
app.register(routes);

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