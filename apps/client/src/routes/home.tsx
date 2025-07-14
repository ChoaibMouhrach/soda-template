import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { getProfile } from "@/api/auth/profile";
import { CustomError } from "@/lib/utils";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: async () => {
    try {
      await getProfile();
      throw redirect({
        to: "/profile",
      });
    } catch (err) {
      if (err instanceof CustomError) {
        throw redirect({
          to: "/sign-in",
        });
      }

      throw err;
    }
  },
});
