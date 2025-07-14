import type { DB } from "@server/db";
import { BaseRepo, BaseRepoInstance } from "../lib/repo";
import { tokensTable, type TToken, type TTokenInsert } from "@server/db/schema";
import { and, eq, ilike, inArray, or } from "drizzle-orm";
import { UserRepo } from "@server/repos/user";
import { NotFoundError } from "@server/lib/error";
import type { TokenTypeValues } from "@server/lib/constants";

export class TokenInstance extends BaseRepoInstance<typeof tokensTable> {
  public user;

  public constructor(data: TToken, db: DB) {
    super(
      data,
      db,
      new TokenRepo(db, {
        userId: data.userId,
      })
    );

    this.user = new UserRepo(db, {
      userId: data.userId,
    });
  }
}

export class TokenRepo<
  T extends { userId: string } | undefined,
> extends BaseRepo<typeof tokensTable, TokenInstance> {
  public table = tokensTable;
  private config: T;
  protected notFoundError = new NotFoundError("token not found");

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

  public mapInstance(rec: TToken) {
    return new TokenInstance(rec, this.db);
  }

  public create(
    inputs: T extends { userId: string }
      ? (Omit<TTokenInsert, "userId"> & { userId?: string })[]
      : TTokenInsert[]
  ) {
    return super.create(
      inputs.map((input) => ({
        ...input,
        userId: ("userId" in input ? input.userId : this.config?.userId) || "",
      }))
    );
  }

  public async find(options?: {
    where?:
      | { ids: string[] }
      | { tokens: string[] }
      | { ilike: { [k in keyof TToken]?: TToken[k] } };
    limit?: number;
    offset?: number;
  }) {
    let query = this.db.select().from(this.table).$dynamic();

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const tokens = await query.where(
      and(
        ...this.getBaseConditions(),
        ...(options?.where
          ? [
              "ids" in options.where
                ? inArray(this.table.id, options.where.ids)
                : undefined,
              "tokens" in options.where
                ? inArray(this.table.token, options.where.tokens)
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

    return this.mapInstances(tokens);
  }

  public async remove(options?: {
    where?: { ids?: string[]; tokens?: string[]; types?: TokenTypeValues[] };
  }) {
    await this.db.delete(this.table).where(
      and(
        ...this.getBaseConditions(),

        ...(options?.where
          ? [
              options.where.ids
                ? inArray(this.table.id, options.where.ids)
                : undefined,
              options.where.tokens
                ? inArray(this.table.token, options.where.tokens)
                : undefined,

              options.where.types
                ? inArray(this.table.type, options.where.types)
                : undefined,
            ]
          : [])
      )
    );
  }
}
