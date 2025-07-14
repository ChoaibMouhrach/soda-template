import { t, type Static } from "elysia";

export const signInSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export type SignInPayload = Static<typeof signInSchema>;

export const signUpSchema = t.Object({
  firstName: t.String({ minLength: 3 }),
  lastName: t.String({ minLength: 3 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  passwordConfirmation: t.String({ minLength: 8 }),
});

export type SignUpPayload = Static<typeof signUpSchema>;

export const forgotPasswordSchema = t.Object({
  email: t.String({ format: "email" }),
});

export type ForgotPasswordPayload = Static<typeof forgotPasswordSchema>;

export const resetPasswordSchema = t.Object({
  passwordConfirmation: t.String({ minLength: 8 }),
  password: t.String({ minLength: 8 }),
  token: t.String({ format: "uuid" }),
});

export type ResetPasswordPayload = Static<typeof resetPasswordSchema>;

export const requestEmailConfirmationSchema = t.Object({
  email: t.String({
    format: "email",
  }),
});

export type RequestEmailConfirmationPayload = Static<
  typeof requestEmailConfirmationSchema
>;

export const updateProfileSchema = t.Object({
  firstName: t.String({ minLength: 1 }),
  lastName: t.String({ minLength: 1 }),
  avatar: t.Union([
    t.File({
      type: ["image/png"],
      maxSize: 536870912, // 512MB
    }),
    t.Null(),
  ]),
});

export type UpdateProfilePayload = Static<typeof updateProfileSchema>;

export const changePasswordSchema = t.Object({
  currentPassword: t.String({ minLength: 8 }),
  newPassword: t.String({ minLength: 8 }),
  newPasswordConfirmation: t.String({ minLength: 8 }),
});

export type ChangePasswordPayload = Static<typeof changePasswordSchema>;

export const requestChangeEmailAddressPayload = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export type RequestChangeEmailAddressPayload = Static<
  typeof requestChangeEmailAddressPayload
>;

export const createAppSchema = t.Object({
  title: t.String({ minLength: 1 }),
  description: t.String(),
});

export type CreateAppPayload = Static<typeof createAppSchema>;

export const setRedirectUrlsSchema = t.Object({
  urls: t.Array(t.String({ format: "uri-template" }), { uniqueItems: true }),
});

export type SetRedirectUrlsPayload = Static<typeof setRedirectUrlsSchema>;
