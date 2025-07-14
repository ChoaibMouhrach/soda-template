import type { DB } from "@server/db";
import {
  sessionsTable,
  type TSession,
  type TSessionInsert,
} from "@server/db/schema";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import { UserRepo } from "./user";
import { and, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { NotFoundError } from "@server/lib/error";

export class SessionInstance extends BaseRepoInstance<typeof sessionsTable> {
  public user;

  public constructor(data: TSession, db: DB) {
    super(
      data,
      db,
      new SessionRepo(db, {
        userId: data.userId,
      })
    );

    this.user = new UserRepo(db, {
      userId: data.userId,
    });
  }
}

export class SessionRepo<
  T extends { userId: string } | undefined,
> extends BaseRepo<typeof sessionsTable, SessionInstance> {
  public table = sessionsTable;
  public config: T;
  public notFoundError = new NotFoundError("session not found");

  public constructor(db: DB, config: T) {
    super(db);
    this.config = config;
  }

  public mapInstance(rec: TSession) {
    return new SessionInstance(rec, this.db);
  }

  public getBaseConditions(): (SQL<unknown> | undefined)[] {
    return [
      this.config ? eq(this.table.userId, this.config.userId) : undefined,
    ];
  }

  public async find(options?: {
    where?:
      | { ids: string[] }
      | { sessions: string[] }
      | { ilike: { [k in keyof TSession]?: TSession[k] } };
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

    const sessions = await query.where(
      and(
        ...this.getBaseConditions(),
        ...(options?.where
          ? [
              "ids" in options.where
                ? inArray(this.table.id, options.where.ids)
                : undefined,
              "sessions" in options.where
                ? inArray(this.table.session, options.where.sessions)
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

    return this.mapInstances(sessions);
  }

  public create(
    inputs: T extends { userId: string }
      ? (Omit<TSessionInsert, "userId"> & { userId?: string })[]
      : TSessionInsert[]
  ) {
    return super.create(
      inputs.map((input) => ({
        ...input,
        userId: ("userId" in input ? input.userId : this.config?.userId) || "",
      }))
    );
  }
}
