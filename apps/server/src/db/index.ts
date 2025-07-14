import { Pool } from "pg";
import { env } from "@server/lib/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const initDB = async () => {
  const dialect = new Pool({
    database: env.SERVER_DATABASE_NAME,
    host: env.SERVER_DATABASE_HOST,
    user: env.SERVER_DATABASE_USER,
    port: env.SERVER_DATABASE_PORT,
    password: env.SERVER_DATABASE_PASS,
  });

  try {
    await dialect.connect();
  } catch (error) {
    console.error("database", error);
    throw error;
  }

  return drizzle(dialect, {
    schema,
  });
};

export type DB = Omit<Awaited<ReturnType<typeof initDB>>, "$client">;

type RawTables = typeof schema;
type PgTables = RawTables[keyof RawTables];

export type Tables = Extract<PgTables, { _: any }>;
