import "./index.css";
import { routeTree } from "./routes";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { CustomProvider } from "./custom-provider";

const router = createRouter({
  routeTree,
});

export const App = () => {
  return (
    <CustomProvider>
      <RouterProvider router={router} />
    </CustomProvider>
  );
};

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
