import { eq } from "drizzle-orm";
import type { DB } from "@server/db";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import {
  passwordsTable,
  type TPassword,
  type TPasswordInsert,
} from "@server/db/schema";
import { NotFoundError } from "@server/lib/error";

export class PasswordInstance extends BaseRepoInstance<typeof passwordsTable> {
  public constructor(data: TPassword, db: DB) {
    super(
      data,
      db,
      new PasswordRepo(db, {
        userId: data.userId,
      })
    );
  }
}

export class PasswordRepo<
  T extends { userId?: string } | undefined,
> extends BaseRepo<typeof passwordsTable, PasswordInstance> {
  public table = passwordsTable;
  protected config: T;
  protected notFoundError = new NotFoundError("password not found");

  public constructor(db: DB, config: T) {
    super(db);

    this.config = config;
  }

  public getBaseConditions() {
    return [
      this.config?.userId
        ? eq(this.table.userId, this.config.userId)
        : undefined,
    ];
  }

  public mapInstance(rec: TPassword) {
    return new PasswordInstance(rec, this.db);
  }

  public create(
    inputs: T extends { userId: string }
      ? (Omit<TPasswordInsert, "userId"> & { userId?: string })[]
      : TPasswordInsert[]
  ) {
    return super.create(
      inputs.map((input) => ({
        ...input,
        userId: ("userId" in input ? input.userId : this.config?.userId) || "",
      }))
    );
  }
}
