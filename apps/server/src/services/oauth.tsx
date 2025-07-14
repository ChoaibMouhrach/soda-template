import { env } from "@server/lib/env";
import type { Database } from "@server/repos";

export class OAuthService {
  protected db;

  public constructor(db: Database) {
    this.db = db;
  }

  public generateOauthUrl(data: {
    appId: string;
    state?: string;
    redirectUrl: string;
  }) {
    return this.db.transaction(async (tx) => {
      const app = await tx.apps.findFirstOrThrow({
        where: {
          ids: [data.appId],
        },
      });

      await app.redirectUrls.findFirstOrThrow({
        where: {
          urls: [data.redirectUrl],
        },
      });

      const url = new URL("/oauth/sign-in", env.VITE_CLIENT_URL);

      url.searchParams.set("appId", data.appId);
      url.searchParams.set("redirectUrl", data.redirectUrl);

      if (data.state) {
        url.searchParams.set("state", data.state);
      }

      return url.toString();
    });
  }
}
