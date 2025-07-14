import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  SERVER_URL: z.string().url(),
  SERVER_PORT: z.string().transform(Number).pipe(z.number().int().positive()),

  // SECURITY
  SERVER_AUTH_COOKIE_DOMAIN: z.string().min(1),

  // RESEND
  SERVER_RESEND_DOMAIN: z.string().min(3).includes("."),
  SERVER_RESEND_TOKEN: z.string().startsWith("re_"),

  // CLIENT
  VITE_CLIENT_URL: z.string().url(),

  // AWS
  SERVER_AWS_ACCESS_KEY_ID: z.string().nonempty(),
  SERVER_AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
  SERVER_AWS_REGION: z.string().nonempty(),
  SERVER_AWS_BUCKET: z.string().nonempty(),
  VITE_STORAGE_URL: z.string().url(),

  // DATABASE
  SERVER_DATABASE_NAME: z.string().min(3),
  SERVER_DATABASE_USER: z.string().min(3),
  SERVER_DATABASE_PASS: z.string().min(8),
  SERVER_DATABASE_HOST: z.string().min(8),
  SERVER_DATABASE_PORT: z
    .string()
    .nonempty()
    .transform(Number)
    .pipe(z.number().int().positive()),
});

export const env = schema.parse(process.env);
