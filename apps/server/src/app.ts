import type { DB } from "./db";
import { Elysia, type SingletonBase } from "elysia";
import type { TTools } from "./tools";
import { mainController } from "./controllers";
import type { UserInstance } from "./repos/user";
import { AppError } from "./lib/error";
import type { ErrorType } from "@soda/constants";

export interface TContext extends SingletonBase {
  decorator: {
    tools: TTools;
  };
}

export interface TAuthContext extends TContext {
  decorator: TContext["decorator"] & {
    tx: DB;
    auth: {
      user: UserInstance;
    };
  };
}

export const initApp = (tools: TTools) => {
  const app = new Elysia()
    // set tools
    .decorate("tools", tools)

    // handle errors
    .onError((context): ErrorType => {
      if (context.error instanceof AppError) {
        context.set.status = context.error.status;
        return {
          success: false,
          error: context.error.message,
          code: context.error.errorCode,
        };
      }

      console.error(context.error);

      context.set.status = 500;
      return {
        success: false,
        error: "something went wrong",
        code: "internal_server_error",
      };
    })

    // add main controller
    .use(mainController);

  return app;
};
