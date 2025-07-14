import type { TAppInsert } from "@server/db/schema";
import { DEFAULT_RECORDS_LIMIT } from "@server/lib/constants";
import { AppError } from "@server/lib/error";
import type { Database } from "@server/repos";
import type { AppInstance } from "@server/repos/app";
import type { AppRedirectUrlInstance } from "@server/repos/app-redirect-urls";
import type { AppSecretInstance } from "@server/repos/app-secret";

export class AppService {
  protected db;

  public constructor(db: Database) {
    this.db = db;
  }

  public get(
    options: { userId: string },
    meta: { q?: string; page: number },
    withCount: true,
  ): Promise<{
    apps: {
      app: AppInstance;
      secret: AppSecretInstance;
      redirectUrls: AppRedirectUrlInstance[];
    }[];
    count: number;
    limit: number;
  }>;
  public get(
    options: { userId: string },
    meta: { q?: string; page: number },
    withCount?: boolean,
  ): Promise<{
    apps: {
      app: AppInstance;
      secret: AppSecretInstance;
      redirectUrls: AppRedirectUrlInstance[];
    }[];
    count?: number;
    limit: number;
  }> {
    const limit = DEFAULT_RECORDS_LIMIT;

    return this.db.transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: {
          ids: [options.userId],
        },
      });

      const where = meta.q
        ? {
            ilike: {
              title: `%${meta.q}%`,
              description: `%${meta.q}%`,
            },
          }
        : undefined;

      const apps = await user.apps.find({
        where,
        limit,
        offset: (meta.page - 1) * limit,
      });

      const secrets = await tx.secrets.find({
        where: {
          appIds: apps.map((app) => app.data.id),
        },
      });

      const redirectInstances = await tx.appRedirectUrls.find({
        where: {
          appIds: apps.map((app) => app.data.id),
        },
      });

      const base = {
        apps: apps.map((app) => {
          const secret = secrets.find((secret) => {
            return secret.data.appId === app.data.id;
          })!;

          const redirectUrls = redirectInstances.filter((redirectUrl) => {
            return redirectUrl.data.appId === app.data.id;
          })!;

          return {
            app,
            secret,
            redirectUrls,
          };
        }),
        limit,
      } as const;

      if (!withCount) {
        return {
          ...base,
        };
      }

      const count = await user.apps.count({
        where,
      });

      return {
        ...base,
        count,
      };
    });
  }

  public create(input: TAppInsert) {
    return this.db.transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: {
          ids: [input.userId],
        },
      });

      const app = await user.apps.createFirst([
        {
          title: input.title,
          description: input.description || null,
        },
      ]);

      await app.secrets.createFirst([{}]);
    });
  }

  public update(
    options: { appId: string; userId: string },
    input: Omit<TAppInsert, "userId">,
  ) {
    return this.db.transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: {
          ids: [options.userId],
        },
      });

      const app = await user.apps.findFirstOrThrow({
        where: {
          ids: [options.appId],
        },
      });

      app.data.title = input.title;
      app.data.description = input.description || null;

      await app.save();
    });
  }

  public remove(data: { appId: string; userId: string }) {
    return this.db.transaction(async (tx) => {
      const app = await tx.apps.findFirstOrThrow({
        where: {
          ids: [data.appId],
        },
      });

      if (app.data.userId !== data.userId) {
        throw new AppError(
          "app doesnt belong to the user",
          409,
          "app_not_belong_user",
        );
      }

      await app.remove();
    });
  }

  public regenerateSecret(data: { appId: string }) {
    return this.db.transaction(async (tx) => {
      const app = await tx.apps.findFirstOrThrow({
        where: {
          ids: [data.appId],
        },
      });

      await app.secrets.remove();

      await app.secrets.create([{}]);
    });
  }

  public setRedirectUrls(data: { appId: string; urls: string[] }) {
    return this.db.transaction(async (tx) => {
      const app = await tx.apps.findFirstOrThrow({
        where: {
          ids: [data.appId],
        },
      });

      const urlInstances = await app.redirectUrls.find();

      const toBeCreated = data.urls.filter((url) => {
        return !urlInstances.find((instance) => instance.data.url === url);
      });

      const toBeDeleted = urlInstances.filter((instance) => {
        return !data.urls.includes(instance.data.url);
      });

      await Promise.all([
        toBeCreated.length
          ? app.redirectUrls.create(
              toBeCreated.map((url) => ({
                url,
              })),
            )
          : undefined,
        toBeDeleted.length
          ? app.redirectUrls.remove({
              where: {
                ids: toBeDeleted.map((instance) => instance.data.id),
              },
            })
          : undefined,
      ]);
    });
  }

  public getRedirectUrls(data: { appId: string }) {
    return this.db.transaction(async (tx) => {
      const app = await tx.apps.findFirstOrThrow({
        where: {
          ids: [data.appId],
        },
      });

      return await app.redirectUrls.find();
    });
  }
}
