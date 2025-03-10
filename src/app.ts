import Hapi from "@hapi/hapi";

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  // Define a simple route
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello, Hapi!";
    },
  });

  // Start the server
  try {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

init();
