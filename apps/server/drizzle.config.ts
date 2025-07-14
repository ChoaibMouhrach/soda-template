import { env } from "@server/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: env.SERVER_DATABASE_USER,
    password: env.SERVER_DATABASE_PASS,
    host: env.SERVER_DATABASE_HOST,
    port: env.SERVER_DATABASE_PORT,
    database: env.SERVER_DATABASE_NAME,
    ssl: false,
  },
});
