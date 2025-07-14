import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { SignInPage } from "@/pages/auth/sign-in/page";
import { SignUpPage } from "@/pages/auth/sign-up/page";
import { AuthLayout } from "@/pages/auth/layout";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password/page";
import { ResetPasswordPage } from "@/pages/auth/reset-password/page";
import { z } from "zod";
import { getProfile } from "@/api/auth/profile";
import { CustomError } from "@/lib/utils";

const resetPasswordTokenSchema = z.object({
  token: z.union([
    z.undefined(),
    z.string().uuid(),
    z.any().transform(() => undefined),
  ]),
});

const authLayout = createRoute({
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
  getParentRoute: () => rootRoute,
  loader: async () => {
    try {
      await getProfile();
      throw redirect({
        to: "/profile",
      });
    } catch (err) {
      if (err instanceof CustomError) {
        return;
      }

      throw err;
    }
  },
  id: "auth-layout",
});

const signInRoute = createRoute({
  getParentRoute: () => authLayout,
  component: () => <SignInPage />,
  path: "/sign-in",
});

const signUpRoute = createRoute({
  getParentRoute: () => authLayout,
  component: () => <SignUpPage />,
  path: "/sign-up",
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authLayout,
  component: () => <ForgotPasswordPage />,
  path: "/forgot-password",
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => authLayout,
  component: () => <ResetPasswordPage />,
  validateSearch: (data) => {
    const validation = resetPasswordTokenSchema.safeParse(data);

    if (!validation.success) {
      return {
        token: undefined,
      };
    }

    return validation.data;
  },
  path: "/reset-password",
});

const oauthLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: "/oauth",
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
});

const oauthSignIn = createRoute({
  path: "/sign-in",
  getParentRoute: () => oauthLayout,
  component: () => <SignInPage />,
});

const oauthSignUp = createRoute({
  path: "/sign-up",
  getParentRoute: () => oauthLayout,
  component: () => <SignUpPage />,
});

const forgotPassword = createRoute({
  path: "/forgot-password",
  getParentRoute: () => oauthLayout,
  component: () => <ForgotPasswordPage />,
});

const resetPassword = createRoute({
  path: "/reset-password",
  getParentRoute: () => oauthLayout,
  component: () => <ResetPasswordPage />,
});

const oauthTree = oauthLayout.addChildren([
  oauthSignIn,
  oauthSignUp,
  forgotPassword,
  resetPassword,
]);

export const authTree = authLayout.addChildren([
  signInRoute,
  signUpRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  oauthTree,
]);
