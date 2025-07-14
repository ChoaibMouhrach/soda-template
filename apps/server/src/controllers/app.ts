import { z } from "zod";
import Elysia from "elysia";
import type { TContext } from "@server/app";
import { convertResponse } from "@server/lib/utils";
import { authMiddleware } from "@server/middlewares/auth";
import { setRedirectUrlsSchema, createAppSchema } from "@soda/validations";

const prefix = "/apps";

export const appController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ["app"],
  },
})
  .use(authMiddleware)

  .get("/", async (context) => {
    const user = context.auth.user;
    const { page: rawPage, q: rawQuery } = context.query;
    const page = z
      .union([
        z.literal("").transform(() => 1),
        z.undefined().transform(() => 1),
        z.string().transform((v) => {
          const value = Number(v);
          return value && value > 0 ? value : 1;
        }),
        z
          .array(z.string())
          .transform((v) => v.at(0))
          .transform((v) => {
            const value = Number(v);
            return value && value > 0 ? value : 1;
          }),
      ])
      .parse(rawPage);

    const q = z
      .union([
        z.literal("").transform(() => undefined),
        z.undefined(),
        z.string(),
        z.array(z.string()).transform((v) => v.at(0)),
      ])
      .parse(rawQuery);

    const { apps, count, limit } = await context.tools.services.app.get(
      {
        userId: user.data.id,
      },
      {
        q,
        page,
      },
      true,
    );

    return {
      data: convertResponse(apps),
      meta: {
        lastPage: Math.ceil(count / limit) || 1,
      },
    };
  })

  .post(
    "/",
    async (context) => {
      const user = context.auth.user;
      const body = context.body;

      await context.tools.services.app.create({
        title: body.title,
        description: body.description,
        userId: user.data.id,
      });
    },
    {
      body: createAppSchema,
    },
  )

  .patch(
    "/:appId",
    async (context) => {
      const user = context.auth.user;
      const appId = context.params.appId;

      await context.tools.services.app.update(
        {
          appId,
          userId: user.data.id,
        },
        context.body,
      );
    },
    {
      body: createAppSchema,
    },
  )

  .delete("/:appId", async (context) => {
    const user = context.auth.user;
    const appId = context.params.appId;

    await context.tools.services.app.remove({
      appId,
      userId: user.data.id,
    });
  })

  .post("/:appId/refresh-secret", async (context) => {
    const appId = context.params.appId;

    await context.tools.services.app.regenerateSecret({
      appId,
    });
  })

  .post(
    "/:appId/redirect-urls",
    async (context) => {
      const { appId } = context.params;
      const body = context.body;

      await context.tools.services.app.setRedirectUrls({
        appId,
        urls: body.urls,
      });
    },
    {
      body: setRedirectUrlsSchema,
    },
  )

  .get("/:appId/redirect-urls", async (context) => {
    const { appId } = context.params;

    const redirectUrls = await context.tools.services.app.getRedirectUrls({
      appId,
    });

    return {
      data: convertResponse(redirectUrls),
    };
  });
