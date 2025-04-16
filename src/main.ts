import Hapi, { type RouteDefMethods } from '@hapi/hapi';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import { PrismaClient } from '@prisma/client';
import * as JwtAuth from 'hapi-auth-jwt2';

const { log } = console;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();
const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: 'localhost',
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      payload: {
        allow: ['application/json', 'multipart/form-data'], // Allow both JSON and multipart
        multipart: true // Enable multipart support
      },
      cors:{
        origin: ['http://localhost:3000'],
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        headers: ['Authorization', 'Content-Type'], // Allow specific headers
        maxAge: 600 // Cache preflight responses for 10 minutes
      }
    },

  });
  await server.register(JwtAuth);

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET, // Secret key used to sign the token
    validate: async (decoded: any, request) => {
      // Validate the decoded token (e.g., check if the user exists in the database)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      if (!user) {
        return { isValid: false }; // Invalid token
      }
      return { isValid: true, credentials: user }; // Valid token
    },
    verifyOptions: { algorithms: ['HS256'] } // Algorithm used to sign the token
  });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'API Documentation',
          version: '1.0.0'
        },
        securityDefinitions: {
          Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your Bearer token in the format "Bearer <token>"'
          }
        },
        security: [{ Bearer: [] }] // Apply Bearer auth globally to all routes
      }
    }
  ]);
  // Helper function to dynamically load routes
  const loadRoutes = (method: RouteDefMethods) => {
    method = method.toUpperCase() as RouteDefMethods;
    const fullPath = path.join(__dirname, method);
    if (!fs.existsSync(fullPath)) return;

    const files = fs.readdirSync(fullPath, {
      withFileTypes: true,
      recursive: true
    });

    files.forEach(async (file) => {
      if (file.isDirectory()) {
        let mainFile = 'app.ts';
        let routeHandlerPath = path.join(file.parentPath, file.name, mainFile);
        if (!fs.existsSync(routeHandlerPath)) {
          mainFile = 'app.js';
          routeHandlerPath = path.join(file.parentPath, file.name, mainFile);
        }
        if (fs.existsSync(routeHandlerPath)) {
          const serverRoute = routeHandlerPath
            .split(method)[1]
            .split(mainFile)[0]
            .replaceAll('\\', '/')
            .replaceAll('[', '{')
            .replaceAll(']', '}')
            .slice(0, -1);
          const relativeRoute = `./${method}${serverRoute
            .replaceAll('{', '[')
            .replaceAll('}', ']')}/${mainFile}`;
          // log(method, serverRoute);
          const routeHandler = (await import(relativeRoute)).default;
          const routeOptions = (await import(relativeRoute)).options;

          const options = routeOptions || {
            tags: ['api'],
            description: `Route for ${method.toUpperCase()} ${serverRoute}`
          };
          if (routeHandler) {
            server.route({
              method: method,
              path: `${serverRoute}`,
              handler: routeHandler,
              options
            });
            log(`Route registered: ${method.toUpperCase()} ${serverRoute}`);
          }
        }
      }
    });
  };
  // Load routes for each HTTP method
  console.log(`Server running at: ${server.info.uri}`);
  loadRoutes('get');
  loadRoutes('post');
  loadRoutes('delete');
  loadRoutes('patch');
  server.ext('onRequest', (request, h) => {
    console.log(`Incoming request: ${request.method.toUpperCase()} ${request.url.pathname}`);
    return h.continue;
  });
  try {
    // Start the server
    await server.start();
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

init();
