import { z } from "zod";

const schema = z.object({
  // client
  VITE_PORT: z
    .string()
    .nonempty()
    .transform(Number)
    .pipe(z.number().int().positive()),

  // STORAGE
  VITE_STORAGE_URL: z.string().url(),

  // api
  VITE_API_URL: z.string().url(),
});

export const env = schema.parse(import.meta.env);
