import type { DB } from "@server/db";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import { usersTable, type TUser } from "@server/db/schema";
import { and, eq, ilike, inArray, or } from "drizzle-orm";
import { PasswordRepo } from "./password";
import { SessionRepo } from "./session";
import { TokenRepo } from "@server/repos/token";
import { NotFoundError } from "@server/lib/error";
import { AppRepo } from "./app";

export class UserInstance extends BaseRepoInstance<typeof usersTable> {
  public passwords;
  public sessions;
  public tokens;
  public apps;

  public constructor(data: TUser, db: DB) {
    super(
      data,
      db,
      new UserRepo(db, {
        userId: data.id,
      })
    );

    this.passwords = new PasswordRepo(db, {
      userId: data.id,
    });

    this.sessions = new SessionRepo(db, {
      userId: data.id,
    });

    this.tokens = new TokenRepo(db, {
      userId: data.id,
    });

    this.apps = new AppRepo(db, {
      userId: data.id,
    });
  }
}

export class UserRepo<
  T extends { userId: string } | undefined,
> extends BaseRepo<typeof usersTable, UserInstance> {
  public table = usersTable;
  private config: T;
  protected notFoundError = new NotFoundError("user not found");

  public constructor(db: DB, config: T) {
    super(db);

    this.config = config;
  }

  public getBaseConditions() {
    return [this.config ? eq(this.table.id, this.config.userId) : undefined];
  }

  public mapInstance(rec: TUser) {
    return new UserInstance(rec, this.db);
  }

  public async find(options?: {
    where?:
      | { ids: string[] }
      | { emails: string[] }
      | {
          ilike: {
            [k in keyof TUser]?: TUser[k];
          };
        };
    limit?: number;
    offset?: number;
  }) {
    let query = this.db.select().from(this.table).$dynamic();

    if (options?.where) {
      query = query.where(
        and(
          ...this.getBaseConditions(),
          ...(options.where
            ? [
                "ids" in options.where
                  ? inArray(this.table.id, options.where.ids)
                  : undefined,
                "emails" in options.where
                  ? inArray(this.table.email, options.where.emails)
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
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const users = await query;
    return this.mapInstances(users);
  }
}
