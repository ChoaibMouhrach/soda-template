import { client } from "@/lib/client";
import { onError } from "@/lib/utils";

export const getProfile = () => onError(client.api.auth.profile.get());

export type TGetProfile = Awaited<ReturnType<typeof getProfile>>;
