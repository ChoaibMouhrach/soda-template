import { authTree } from "./auth";
import { dashboardTree } from "./dashboard";
import { homeRoute } from "./home";
import { rootRoute } from "./root";

export const routeTree = rootRoute.addChildren([
  dashboardTree,
  authTree,
  homeRoute,
]);
