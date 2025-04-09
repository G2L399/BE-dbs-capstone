import Hapi from "@hapi/hapi";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const { log } = console;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  // Helper function to dynamically load routes
  const loadRoutes = (method: string) => {
    const fullPath = path.join(__dirname, method);
    if (!fs.existsSync(fullPath)) return;

    const files = fs.readdirSync(fullPath, {
      withFileTypes: true,
      recursive: true,
    });

    files.forEach(async (file) => {
      if (file.isDirectory()) {
        const routePath = file.name.includes("[")
          ? file.name.replace("[", "{").replace("]", "}")
          : file.name;

        const routeHandlerPath = path.join(
          file.parentPath,
          file.name,
          "app.ts"
        );
        if (fs.existsSync(routeHandlerPath)) {
          const serverRoute = routeHandlerPath
            .split(method)[1]
            .split("app.ts")[0]
            .replaceAll("\\", "/")
            .replaceAll("[", "{")
            .replaceAll("]", "}")
            .slice(0, -1);
          log(method, serverRoute);
          const routeHandler = (await import("file://" + routeHandlerPath))
            .default;
          console.log(
            `Route registered: ${method.toUpperCase()} ${serverRoute}`
          );

          server.route({
            method: method.toUpperCase() as "GET" | "POST" | "DELETE" | "PATCH",
            path: `${serverRoute}`,
            handler: routeHandler,
          });
        }
      }
    });
  };

  // Load routes for each HTTP method
  loadRoutes("GET");
  loadRoutes("POST");
  loadRoutes("DELETE");
  loadRoutes("PATCH");

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
