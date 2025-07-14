import Elysia from "elysia";
import type { TContext } from "@server/app";

export const authMiddleware = new Elysia<any, TContext>().derive(
  { as: "scoped" },
  async (context) => {
    const { services } = context.tools;

    const payload = await services.auth.getAuthUser(context);

    return {
      auth: payload.auth,
    };
  },
);
