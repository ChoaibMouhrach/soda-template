import type { DB } from "@server/db";
import { NotFoundError } from "@server/lib/error";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import {
  appRedirectUrlsTable,
  type AppRedirectUrl,
  type AppRedirectUrlInsert,
} from "@server/db/schema";
import { and, eq, ilike, inArray, or } from "drizzle-orm";

type AppRedirectUrlsTable = typeof appRedirectUrlsTable;

export class AppRedirectUrlInstance extends BaseRepoInstance<AppRedirectUrlsTable> {
  public constructor(data: AppRedirectUrl, db: DB) {
    super(
      data,
      db,
      new AppRedirectUrlRepo(db, {
        appId: data.appId,
      })
    );
  }
}

export class AppRedirectUrlRepo<
  TAppId extends string | undefined,
> extends BaseRepo<AppRedirectUrlsTable, AppRedirectUrlInstance> {
  public table = appRedirectUrlsTable;
  protected notFoundError = new NotFoundError("app redirect url not found");
  private appId: TAppId;

  public constructor(db: DB, config: { appId: TAppId }) {
    super(db);
    this.appId = config.appId;
  }

  public getBaseConditions() {
    return [this.appId ? eq(this.table.appId, this.appId) : undefined];
  }

  public mapInstance(rec: AppRedirectUrl) {
    return new AppRedirectUrlInstance(rec, this.db);
  }

  public async find(options?: {
    where?:
      | { ids: string[] }
      | { urls: string[] }
      | { appIds: string[] }
      | { ilike: { [k in keyof AppRedirectUrl]?: AppRedirectUrl[k] } };
    limit?: number;
    offset?: number;
  }) {
    let query = this.db
      .select()
      .from(this.table as never)
      .$dynamic();

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const recs = await query.where(
      and(
        ...this.getBaseConditions(),
        ...(options?.where
          ? [
              "ids" in options.where
                ? inArray(this.table.id, options.where.ids)
                : undefined,
              "urls" in options.where
                ? inArray(this.table.url, options.where.urls)
                : undefined,
              "appIds" in options.where
                ? inArray(this.table.appId, options.where.appIds)
                : undefined,
              "ilike" in options.where
                ? or(
                    ...Object.entries(options.where.ilike).map(
                      ([key, value]) => {
                        return value
                          ? ilike(this.table[key as never], value as never)
                          : undefined;
                      }
                    )
                  )
                : undefined,
            ]
          : [])
      )
    );

    return this.mapInstances(recs);
  }

  public create(
    inputs: TAppId extends string
      ? Omit<AppRedirectUrlInsert, "appId">[]
      : AppRedirectUrlInsert[]
  ) {
    return super.create(
      inputs.map((input) => ({
        ...input,
        appId: ("appId" in input ? input.appId : this.appId) || "",
      }))
    );
  }
}
