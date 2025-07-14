import { client } from "@/lib/client";
import { onError } from "@/lib/utils";

export const getApps = (query: { page: number; q?: string }) => {
  return onError(
    client.api.apps.get({
      query,
    })
  );
};

export type TGetApps = Awaited<ReturnType<typeof getApps>>;
