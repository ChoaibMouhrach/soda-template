import {
  and,
  ilike,
  inArray,
  or,
  sql,
  SQL,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import type { DB, Tables } from "@server/db";
import type { AppError } from "./error";

export abstract class BaseRepoInstance<
  TTable extends Tables,
  TSelect = InferSelectModel<TTable>,
> {
  public data: TSelect;
  public repo;
  public db;

  public constructor(
    data: TSelect,
    db: DB,
    repo: BaseRepo<TTable, BaseRepoInstance<TTable>>
  ) {
    this.data = data;
    this.repo = repo;
    this.db = db;
  }

  public save() {
    return this.repo.update(this.data as never, {
      where: {
        ids: [
          this.data &&
          typeof this.data === "object" &&
          "id" in this.data &&
          typeof this.data.id === "string"
            ? this.data.id
            : "",
        ],
      },
    });
  }

  public remove() {
    return this.repo.remove({
      where: {
        ids: [
          this.data &&
          typeof this.data === "object" &&
          "id" in this.data &&
          typeof this.data.id === "string"
            ? this.data.id
            : "",
        ],
      },
    });
  }

  public toJSON() {
    return this.data;
  }
}

export abstract class BaseRepo<
  TTable extends Tables,
  TInstance extends BaseRepoInstance<TTable>,
  TSelect = InferSelectModel<TTable>,
  TInsert = InferInsertModel<TTable>,
> {
  public db;
  public abstract table: TTable;
  protected abstract notFoundError: AppError;

  public constructor(db: DB) {
    this.db = db;
  }

  public getBaseConditions(): (SQL<unknown> | undefined)[] {
    return [];
  }

  public abstract mapInstance(rec: TSelect): TInstance;
  public mapInstances(recs: TSelect[]) {
    return recs.map((rec) => this.mapInstance(rec));
  }

  public async find(options?: {
    where?:
      | { ids: string[] }
      | { ilike: { [k in keyof TSelect]?: TSelect[k] } };
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

    return this.mapInstances(recs as TSelect[]);
  }

  public async count(options?: {
    where?:
      | { ids: string[] }
      | { ilike: { [k in keyof TSelect]?: TSelect[k] } };
  }) {
    let query = this.db
      .select({
        count: sql`COUNT(*)`.mapWith(Number),
      })
      .from(this.table as never)
      .$dynamic();

    const recs = await query.where(
      and(
        ...this.getBaseConditions(),
        ...(options?.where
          ? [
              "ids" in options.where
                ? inArray(this.table.id, options.where.ids)
                : undefined,
              ...("ilike" in options.where
                ? Object.entries(options.where.ilike).map(([key, value]) =>
                    ilike(this.table[key as never], value as never)
                  )
                : []),
            ]
          : [])
      )
    );

    const [{ count }] = recs as never as [{ count: number }];

    return count;
  }

  public async findFirst<T = Parameters<this["find"]>[0]>(
    options?: T extends { limit?: number } ? Omit<T, "limit"> : T
  ) {
    const recs = await this.find({
      ...options,
      limit: 1,
    });

    return recs.at(0) || null;
  }

  public async findFirstOrThrow<T = Parameters<this["find"]>[0]>(
    options?: T extends { limit?: number } ? Omit<T, "limit"> : T
  ) {
    const rec = await this.findFirst({
      ...options,
    });

    if (!rec) {
      throw this.notFoundError;
    }

    return rec;
  }

  public async create(inputs: TInsert[]) {
    // @ts-expect-error
    const recs = await this.db.insert(this.table).values(inputs).returning();
    return this.mapInstances(recs as never as TSelect[]);
  }

  public async createFirst(inputs: Parameters<this["create"]>[0]) {
    const [rec] = await this.create(inputs);

    if (!rec) {
      throw new Error("Record expected to exist");
    }

    return rec;
  }

  public async update(
    input: Partial<TSelect>,
    options?: { where?: { ids: string[] } }
  ) {
    await this.db
      .update(this.table)
      .set(input as never)
      .where(
        and(
          ...this.getBaseConditions(),
          options?.where && "id" in options.where
            ? inArray(this.table.id, options.where.ids)
            : undefined
        )
      );
  }

  public async remove(options?: { where?: { ids: string[] } }) {
    await this.db
      .delete(this.table)
      .where(
        and(
          ...this.getBaseConditions(),
          options?.where && "ids" in options.where
            ? inArray(this.table.id, options.where.ids)
            : undefined
        )
      );
  }
}
