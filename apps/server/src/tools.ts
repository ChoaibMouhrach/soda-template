import { initDB } from "./db";
import { env } from "./lib/env";
import { DevMailer, ResendMailer } from "./lib/mailer";
import { BaseStorage, S3Storage } from "./lib/storage";
import { Database } from "./repos";
import { Service } from "./services";

export const initTools = async () => {
  const dbClient = await initDB();

  const db = new Database(dbClient);

  const mailer =
    Bun.env.NODE_ENV === "production"
      ? new ResendMailer({
          domain: env.SERVER_RESEND_DOMAIN,
          resendToken: env.SERVER_RESEND_TOKEN,
        })
      : new DevMailer({
          domain: env.SERVER_RESEND_DOMAIN,
        });

  const storage: BaseStorage = new S3Storage({
    region: env.SERVER_AWS_REGION,
    accessKeyId: env.SERVER_AWS_ACCESS_KEY_ID,
    secretAccessKey: env.SERVER_AWS_SECRET_ACCESS_KEY,
    bucket: env.SERVER_AWS_BUCKET,
  });

  return {
    db,
    mailer,
    storage,
    services: new Service(db),
  };
};

export type TTools = Awaited<ReturnType<typeof initTools>>;
