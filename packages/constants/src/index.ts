export const USER_TYPES = {
  PLATFORM: "platform",
  OAUTH: "oauth",
} as const;

export const USER_TYPES_VALUES = Object.values(USER_TYPES);

export type TUserType = typeof USER_TYPES;
export type TUserTypeKey = keyof TUserType;
export type TUserTypeValue = TUserType[TUserTypeKey];

export const SOMETHING_WENT_WRONG = "something went wrong";

export const ERROR_CODES = {
  UNCONFIRMED_EMAIL: "unconfirmed_email",
};

export type ErrorType = {
  error: string;
  code: string;
  success: false;
};
