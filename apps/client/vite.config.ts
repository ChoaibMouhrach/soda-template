import path from "path";
import { z } from "zod";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

const schema = z.object({
  VITE_PORT: z
    .string()
    .nonempty()
    .transform(Number)
    .pipe(z.number().int().positive()),
});

const env = schema.parse(process.env);

const config = defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: env.VITE_PORT,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

export default config;
