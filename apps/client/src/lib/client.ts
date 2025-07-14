import type { App } from "@server/index";
import { treaty } from "@elysiajs/eden";
import { env } from "./env";

export const client = treaty<App>(env.VITE_API_URL, {
  fetch: {
    credentials: "include",
  },
});
