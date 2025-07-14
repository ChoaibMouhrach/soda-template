import { relations } from "drizzle-orm";
import { USER_TYPES, USER_TYPES_VALUES } from "@soda/constants";
import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { TOKEN_TYPE_VALUES, TOKEN_TYPES } from "@server/lib/constants";

const id = () => uuid().notNull().primaryKey().defaultRandom();
const timestamps = () => ({
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
});

export const userTypesEnum = pgEnum("userTypes", [
  USER_TYPES.PLATFORM,
  ...USER_TYPES_VALUES.filter((type) => type !== USER_TYPES.PLATFORM),
]);

export const usersTable = pgTable("users", {
  id: id(),

  // -- fields
  firstName: text().notNull(),
  lastName: text().notNull(),
  avatar: text(),
  email: text().notNull(),
  type: userTypesEnum().notNull().default("platform"),

  // -- timestamps
  createdAt: timestamp().notNull().defaultNow(),
  emailConfirmedAt: timestamp(),
});

export type TUser = typeof usersTable.$inferSelect;
export type TUserInsert = typeof usersTable.$inferInsert;

const userId = () =>
  uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" });

export const userRelations = relations(usersTable, ({ many }) => ({
  passwords: many(passwordsTable),
  sessions: many(sessionsTable),
  tokens: many(tokensTable),
}));

export const passwordsTable = pgTable("passwords", {
  id: id(),

  // -- fields
  password: text().notNull(),

  // -- foreign keys
  userId: userId(),

  // -- timestamp
  createdAt: timestamp().notNull().defaultNow(),
});

export type TPassword = typeof passwordsTable.$inferSelect;
export type TPasswordInsert = typeof passwordsTable.$inferInsert;

export const passwordRelations = relations(passwordsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [passwordsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsTable = pgTable("sessions", {
  id: id(),

  // -- fields
  session: uuid().notNull().defaultRandom(),

  // -- foreign keys
  userId: userId(),
});

export type TSession = typeof sessionsTable.$inferSelect;
export type TSessionInsert = typeof sessionsTable.$inferInsert;

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const tokenTypesEnum = pgEnum("tokenTypes", [
  TOKEN_TYPES.EMAIL_CONFIRMATION,
  ...TOKEN_TYPE_VALUES.filter((v) => v !== TOKEN_TYPES.EMAIL_CONFIRMATION),
]);

export const tokensTable = pgTable("tokens", {
  id: id(),

  // -- fields
  token: uuid().notNull().defaultRandom(),
  type: tokenTypesEnum().notNull(),
  payload: jsonb(),

  // -- foreign keys
  userId: userId(),

  // -- timestamps
  createdAt: timestamp().notNull().defaultNow(),
});

export type TToken = typeof tokensTable.$inferSelect;
export type TTokenInsert = typeof tokensTable.$inferInsert;

export const tokenRelations = relations(tokensTable, ({ one }) => ({
  userId: one(usersTable, {
    fields: [tokensTable.userId],
    references: [usersTable.id],
  }),
}));

export const appsTable = pgTable("apps", {
  id: id(),

  // -- fields
  title: text().notNull(),
  description: text(),

  // -- foreign keys
  userId: userId(),

  // -- timestamps
  ...timestamps(),
});

export type TApp = typeof appsTable.$inferSelect;
export type TAppInsert = typeof appsTable.$inferInsert;

const appId = () =>
  uuid()
    .notNull()
    .references(() => appsTable.id, {
      onDelete: "cascade",
    });

export const appRelations = relations(appsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [appsTable.userId],
    references: [usersTable.id],
  }),
}));

export const appUserTable = pgTable("appUser", {
  id: id(),

  // -- foreign keys
  appId: appId(),
  userId: userId(),

  // -- timestamps
  ...timestamps(),
});

export type TAppUser = typeof appUserTable.$inferSelect;
export type TAppUserInsert = typeof appUserTable.$inferInsert;

export const appUserRelations = relations(appUserTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [appUserTable.userId],
    references: [usersTable.id],
  }),
  app: one(appsTable, {
    fields: [appUserTable.appId],
    references: [appsTable.id],
  }),
}));

export const appSecretsTable = pgTable("appSecrets", {
  id: id(),

  // -- fields
  secret: uuid().notNull().defaultRandom(),

  // -- foreign keys
  appId: appId(),

  // -- timestamps
  ...timestamps(),
});

export type TAppSecret = typeof appSecretsTable.$inferSelect;
export type TAppSecretInsert = typeof appSecretsTable.$inferInsert;

export const appSecretRelations = relations(appSecretsTable, ({ one }) => ({
  app: one(appsTable, {
    fields: [appSecretsTable.appId],
    references: [appsTable.id],
  }),
}));

export const appRedirectUrlsTable = pgTable("appRedirectUrls", {
  id: id(),

  // -- field
  url: text().notNull(),

  // -- foreign keys
  appId: appId(),

  // -- timestamps
  ...timestamps(),
});

export type AppRedirectUrl = typeof appRedirectUrlsTable.$inferSelect;
export type AppRedirectUrlInsert = typeof appRedirectUrlsTable.$inferInsert;

export const appRedirectUrlRelations = relations(
  appRedirectUrlsTable,
  ({ one }) => ({
    app: one(appsTable, {
      fields: [appRedirectUrlsTable.appId],
      references: [appsTable.id],
    }),
  })
);
