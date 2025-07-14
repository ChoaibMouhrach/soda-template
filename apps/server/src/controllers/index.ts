import { Elysia } from "elysia";
import type { TContext } from "@server/app";
import { authController } from "./auth";
import { appController } from "./app";
import { oAuthController } from "./oauth";

const prefix = "/api";

export const mainController = new Elysia<typeof prefix, TContext>({
  prefix,
})
  .use(authController)
  .use(appController)
  .use(oAuthController);
