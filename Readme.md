# Hapi Coding Camp Project

This project demonstrates a basic Hapi server setup with dynamically loaded routes based on file system structure.

## Requirements

Node version >= 23.0.0 OR use ts-node

## Project Structure

The project structure is organized as follows:

- `src/`: Contains the source code for the Hapi server.
  - `app.ts`: The main application file that initializes and starts the Hapi server.
  - `GET/`, `POST/`, `DELETE/`, `PATCH/`: Directories for each HTTP method.
    - `destination/`: Example route for destinations.
      - `app.ts`: Handles requests to `/destination`.
      - `[id]/`: Route parameter for a specific destination ID.
        - `app.ts`: Handles requests to `/destination/{id}`.

## Naming Conventions and Route Creation

The project uses a file-system-based routing mechanism. Here's how routes are defined:

1.  **HTTP Method Directories:** Routes are organized under directories named after HTTP methods (`GET`, `POST`, `DELETE`, `PATCH`).
2.  **Route Path:** The directory structure within the HTTP method directory determines the route path. For example, `src/GET/destination/app.ts` corresponds to the `/destination` route with the GET method.
3.  **Route Handler:** Each route directory contains an `app.ts` file, which exports a default function that serves as the route handler.
4.  **Route Parameters:** Dynamic route segments (parameters) are defined using square brackets `[]` in the directory name. For example, `src/GET/destination/[id]/app.ts` corresponds to the `/destination/{id}` route, where `{id}` is a route parameter. In the `app.ts` file, the parameter can be accessed via `request.params.id`.
5.  **Route Registration:** The `app.ts` file dynamically reads the file system and registers routes based on the directory structure.

### Example

To create a new GET route for `/travels`, you would:

1.  Create a directory `travels` inside the `src/GET/` directory.
2.  Create a file named `app.ts` inside the `travels` directory.
3.  Implement the route handler function in `app.ts`.

    ```typescript
    // filepath: src/GET/travels/app.ts
    import Hapi from "@hapi/hapi";

    export default (
      request: Hapi.Request<Hapi.ReqRefDefaults>,
      h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
    ) => {
      return "GET request to /travels";
    };
    ```

4.  You can also run the command
    ```bash
    node create {METHOD} {ROUTE}
    ```
    to create a new route. this will create a new app.ts file at src/{METHOD}/{ROUTE}

## Running the Application

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Start the server:

    ```bash
    npm start
    ```

The server will start at `http://localhost:3000`.
