import { Elysia } from "elysia";
import type { TContext } from "@server/app";
import { authMiddleware } from "@server/middlewares/auth";
import {
  requestChangeEmailAddressPayload,
  changePasswordSchema,
  forgotPasswordSchema,
  requestEmailConfirmationSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
} from "@soda/validations";
import { AppError, UnauthenticatedError } from "@server/lib/error";
import { env } from "@server/lib/env";
import { convertResponse } from "@server/lib/utils";

const prefix = "/auth";

export const authController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ["auth"],
  },
})

  .guard((app) =>
    app
      .post(
        "/sign-up",
        async (context) => {
          const { services, mailer } = context.tools;
          const body = context.body;

          await services.auth.signUp(
            {
              firstName: body.firstName,
              lastName: body.lastName,
              password: body.password,
              email: body.email,
            },
            {
              mailer,
            }
          );
        },
        {
          body: signUpSchema,
        }
      )

      .post(
        "/sign-in",
        async (context) => {
          const { services } = context.tools;
          const body = context.body;

          await services.auth.singIn(
            {
              email: body.email,
              password: body.password,
            },
            context
          );
        },
        {
          body: signInSchema,
        }
      )

      .post(
        "/request-email-confirmation",
        async (context) => {
          const body = context.body;

          await context.tools.services.auth.requestEmailConfirmation(
            {
              email: body.email,
            },
            {
              mailer: context.tools.mailer,
            }
          );
        },
        {
          body: requestEmailConfirmationSchema,
        }
      )

      .get("/confirm-email", async (context) => {
        const token = context.query["token"];

        if (!token) {
          // todo: redirect instead
          throw new UnauthenticatedError();
        }

        await context.tools.services.auth.confirmEmail({
          token,
        });

        return context.redirect(
          new URL("/sign-in", env.VITE_CLIENT_URL).toString()
        );
      })

      .post(
        "/forgot-password",
        async (context) => {
          const body = context.body;

          await context.tools.services.auth.forgotPassword(
            {
              email: body.email,
            },
            {
              mailer: context.tools.mailer,
            }
          );
        },
        {
          body: forgotPasswordSchema,
        }
      )

      .post(
        "/reset-password",
        async (context) => {
          const body = context.body;

          await context.tools.services.auth.resetPassword({
            token: body.token,
            password: body.password,
          });
        },
        {
          body: resetPasswordSchema,
        }
      )
  )

  .guard((app) =>
    app
      .use(authMiddleware)

      .get("/profile", async (context) => {
        const { user } = context.auth;

        return convertResponse({
          user,
        });
      })

      .patch(
        "/profile",
        async (context) => {
          const body = context.body;

          await context.tools.services.auth.updateProfile(
            {
              firstName: body.firstName,
              lastName: body.lastName,
              auth: context.auth.user,
              avatar: body.avatar,
            },
            {
              storage: context.tools.storage,
            }
          );
        },
        {
          body: updateProfileSchema,
        }
      )

      .post(
        "/change-password",
        async (context) => {
          const body = context.body;

          await context.tools.services.auth.updatePassword(
            {
              currentPassword: body.currentPassword,
              newPassword: body.newPassword,
            },
            context.auth.user
          );
        },
        {
          body: changePasswordSchema,
        }
      )

      .post(
        "/request-change-email-address",
        async (context) => {
          const body = context.body;

          await context.tools.services.auth.requestChangeEmailAddress(
            {
              auth: context.auth.user,
              email: body.email,
              password: body.password,
            },
            {
              mailer: context.tools.mailer,
            }
          );
        },
        {
          body: requestChangeEmailAddressPayload,
        }
      )

      .get("/change-email-address", async (context) => {
        const token = context.query["token"];

        if (!token) {
          // todo:! redirect instead
          throw new AppError("invalid token", 409, "invalid_token");
        }

        await context.tools.services.auth.changeEmailAddress({
          token,
        });

        return context.redirect(
          new URL("/profile", env.VITE_CLIENT_URL).toString()
        );
      })

      .post("/sign-out", async (context) => {
        const { session } = context.auth;

        await context.tools.services.auth.signOut({
          session,
        });
      })
  );
