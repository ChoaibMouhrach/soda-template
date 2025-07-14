import type { DB } from "@server/db";
import { NotFoundError } from "@server/lib/error";
import { appsTable, type TApp, type TAppInsert } from "@server/db/schema";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import { eq } from "drizzle-orm";
import { AppSecretRepo } from "./app-secret";
import { AppRedirectUrlRepo } from "./app-redirect-urls";

export class AppInstance extends BaseRepoInstance<typeof appsTable> {
  public secrets;
  public redirectUrls;

  public constructor(data: TApp, db: DB) {
    super(
      data,
      db,
      new AppRepo(db, {
        userId: data.userId,
      })
    );

    this.secrets = new AppSecretRepo(db, {
      appId: data.id,
    });

    this.redirectUrls = new AppRedirectUrlRepo(db, {
      appId: data.id,
    });
  }
}

export class AppRepo<TUserId extends string | undefined> extends BaseRepo<
  typeof appsTable,
  AppInstance
> {
  public table = appsTable;
  protected notFoundError = new NotFoundError("app not found");
  private userId;

  public constructor(db: DB, config?: { userId: TUserId }) {
    super(db);
    this.userId = config?.userId || undefined;
  }

  public getBaseConditions() {
    return [this.userId ? eq(this.table.userId, this.userId) : undefined];
  }

  public mapInstance(rec: TApp): AppInstance {
    return new AppInstance(rec, this.db);
  }

  public create(
    inputs: TUserId extends undefined
      ? TAppInsert[]
      : Omit<TAppInsert, "userId">[]
  ) {
    return super.create(
      inputs.map((input) => ({
        ...input,
        userId: ("userId" in input ? input.userId : this.userId) || "",
      }))
    );
  }
}
