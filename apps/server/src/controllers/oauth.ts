import type { TContext } from "@server/app";
import { AppError } from "@server/lib/error";
import Elysia from "elysia";

const prefix = "/oauth";

export const oAuthController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ["oauth"],
  },
}).get("/:appId/generate-url", async (context) => {
  const appId = context.params.appId;
  const redirectUrl = context.query["redirectUrl"];

  if (!redirectUrl) {
    throw new AppError("redirectUrl is required", 409, "required_redirect_url");
  }

  const state = context.query["state"];

  const url = await context.tools.services.oauth.generateOauthUrl({
    appId,
    state,
    redirectUrl,
  });

  return {
    data: {
      url,
    },
  };
});
