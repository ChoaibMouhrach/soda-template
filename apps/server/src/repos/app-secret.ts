import type { DB } from "@server/db";
import {
  appSecretsTable,
  type TAppSecret,
  type TAppSecretInsert,
} from "@server/db/schema";
import { NotFoundError } from "@server/lib/error";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import { and, eq, ilike, inArray, or } from "drizzle-orm";

export class AppSecretInstance<
  TSelect extends TAppSecret = TAppSecret,
> extends BaseRepoInstance<typeof appSecretsTable> {
  public constructor(data: TSelect, db: DB) {
    super(
      data,
      db,
      new AppSecretRepo(db, {
        appId: data.appId,
      })
    );
  }
}

export class AppSecretRepo<TAppId extends string | undefined> extends BaseRepo<
  typeof appSecretsTable,
  AppSecretInstance
> {
  public table = appSecretsTable;
  protected notFoundError = new NotFoundError("app not found");
  private appId: TAppId;

  public constructor(db: DB, config: { appId: TAppId }) {
    super(db);

    this.appId = config.appId;
  }

  public getBaseConditions() {
    return [this.appId ? eq(this.table.appId, this.appId) : undefined];
  }

  public mapInstance(rec: TAppSecret): AppSecretInstance {
    return new AppSecretInstance(rec, this.db);
  }

  public create(
    inputs: TAppId extends string
      ? Omit<TAppSecretInsert, "appId">[]
      : TAppSecretInsert[]
  ) {
    return super.create(
      inputs.map((input) => ({
        ...input,
        appId: ("appId" in input ? input.appId : this.appId) || "",
      }))
    );
  }

  public async find(options?: {
    where?:
      | { ids: string[] }
      | { appIds: string[] }
      | { ilike: { [k in keyof TAppSecret]?: TAppSecret[k] } };
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
}
