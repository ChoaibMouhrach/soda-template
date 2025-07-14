import { rootRoute } from "./root";
import { getProfile } from "@/api/auth/profile";
import { AppsPage } from "@/pages/(dashboard)/apps/page";
import { DashboardLayout } from "@/pages/(dashboard)/layout";
import { ProfilePage } from "@/pages/(dashboard)/profile/page";
import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";

const dashboardLayout = createRoute({
  getParentRoute: () => rootRoute,
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
  loader: async () => {
    try {
      await getProfile();
    } catch {
      throw redirect({
        to: "/sign-in",
      });
    }
  },
  id: "dashboard-layout",
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  component: () => <ProfilePage />,
  path: "/profile",
});

export const appsRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  component: () => <AppsPage />,
  path: "/apps",
  validateSearch: z.object({
    q: z.union([
      z.string(),
      z.undefined(),
      z.array(z.string()).transform((arr) => arr.at(0)),
    ]),
    page: z.union([
      z.number().transform((v) => {
        return v >= 1 ? v : 1;
      }),
      z.string().transform((v) => {
        const value = Number(v);
        return value && value >= 1 ? value : 1;
      }),
      z.undefined().transform(() => 1),
      z.array(z.string()).transform((arr) => {
        const value = Number(arr.at(0));
        return value && value >= 1 ? value : 1;
      }),
    ]),
  }),
});

export const dashboardTree = dashboardLayout.addChildren([
  profileRoute,
  appsRoute,
]);
