export const TOKEN_TYPES = {
  EMAIL_CONFIRMATION: "email-confirmation",
  RESET_PASSWORD: "reset-password",
  CHANGE_EMAIL: "change-email",
} as const;

export const TOKEN_TYPE_VALUES = Object.values(TOKEN_TYPES);

export type TokenTypes = typeof TOKEN_TYPES;
export type TokenTypeKeys = keyof TokenTypes;
export type TokenTypeValues = TokenTypes[TokenTypeKeys];

export const DEFAULT_RECORDS_LIMIT = 8;
