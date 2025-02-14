import fastify from 'fastify'
import routes from './routes.js'
import fastifyCors from '@fastify/cors'

const app = fastify({ logger: true });

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

app.register(routes);

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