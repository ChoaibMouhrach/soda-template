import Elysia from "elysia";
import { initApp } from "./app";
import { env } from "./lib/env";
import { initTools } from "./tools";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

const main = async () => {
  const tools = await initTools();

  const app = new Elysia()
    .use(initApp(tools))

    // add swagger
    .use(
      swagger({
        path: "/docs",
      }),
    )

    // add cors
    .use(
      cors({
        origin: [env.VITE_CLIENT_URL],
        credentials: true,
      }),
    );

  // serve
  console.log(`The server is running on port ${env.SERVER_URL}`);
  Bun.serve({
    port: env.SERVER_PORT,
    fetch: app.fetch,
  });

  return app;
};

main();

export type App = Awaited<ReturnType<typeof main>>;
