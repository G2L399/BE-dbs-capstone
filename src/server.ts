import Hapi from '@hapi/hapi';
import user from 'routes/user.js';
import { ServerRoute } from '@hapi/hapi';
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  server.auth.default('jwt');
  server.route([...(user as ServerRoute[])]);

  await server.start();
  console.log('🚀 Server running at:', server.info.uri);
};

init();
