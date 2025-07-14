import {
  AlreadyExistsError,
  AppError,
  NotFoundError,
  UnauthenticatedError,
} from "@server/lib/error";
import bcrypt from "bcryptjs";
import { env } from "@server/lib/env";
import type { Context } from "elysia";
import type { Database } from "@server/repos";
import type { BaseMailer } from "@server/lib/mailer";
import { UserInstance } from "@server/repos/user";
import { SessionInstance } from "@server/repos/session";
import { ERROR_CODES } from "@soda/constants";
import type { TokenInstance } from "@server/repos/token";
import type { BaseStorage } from "@server/lib/storage";

export class AuthService {
  protected db;
  private sessionCookieName = "session";

  public constructor(db: Database) {
    this.db = db;
  }

  public hashPassword(data: { password: string }) {
    return bcrypt.hash(data.password, 10);
  }

  public compareHash(data: { password: string; hashedPassword: string }) {
    return bcrypt.compare(data.password, data.hashedPassword);
  }

  public setSessionCookie(context: Context, session: string) {
    context.cookie[this.sessionCookieName]?.set({
      value: session,
      domain: env.SERVER_AUTH_COOKIE_DOMAIN,
      httpOnly: true,
      secure: Bun.env.NODE_ENV === "production",
      sameSite: Bun.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  public getSessionCookie(context: Context) {
    const cookie = context.cookie[this.sessionCookieName]?.value;
    return cookie;
  }

  public sendConfirmationEmail(
    data: {
      email: string;
      token: string;
    },
    tools: {
      mailer: BaseMailer;
    }
  ) {
    return tools.mailer.sendMail({
      from: "auth",
      to: [data.email],
      subject: "Cofirmation email",
      html: `<a href="${new URL(`/api/auth/confirm-email?token=${data.token}`, env.SERVER_URL).toString()}" >Confirm<a/>`,
    });
  }

  public sendChangeEmailAddress(
    data: {
      email: string;
      token: string;
    },
    tools: {
      mailer: BaseMailer;
    }
  ) {
    return tools.mailer.sendMail({
      from: "auth",
      to: [data.email],
      subject: "Change email address",
      html: `<a href="${new URL(`/api/auth/change-email-address?token=${data.token}`, env.SERVER_URL).toString()}" >Confirm<a/>`,
    });
  }

  public requestEmailConfirmation(
    data: { email: string },
    tools: { mailer: BaseMailer }
  ) {
    return this.db.transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: {
          emails: [data.email],
        },
      });

      await user.tokens.remove({
        where: {
          types: ["email-confirmation"],
        },
      });

      const token = await user.tokens.createFirst([
        {
          type: "email-confirmation",
        },
      ]);

      await this.sendConfirmationEmail(
        {
          email: data.email,
          token: token.data.token,
        },
        {
          mailer: tools.mailer,
        }
      );
    });
  }

  public async signUp(
    data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
    tools: { mailer: BaseMailer }
  ) {
    return this.db.transaction(async (tx) => {
      let user = await tx.user.findFirst({
        where: {
          emails: [data.email],
        },
      });

      if (user) {
        throw new AlreadyExistsError("user already exists");
      }

      user = await tx.user.createFirst([
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
      ]);

      const hashedPassword = await this.hashPassword({
        password: data.password,
      });

      await user.passwords.create([
        {
          password: hashedPassword,
        },
      ]);

      const confirmationEmailToken = await user.tokens.createFirst([
        {
          type: "email-confirmation",
        },
      ]);

      await this.sendConfirmationEmail(
        {
          email: data.email,
          token: confirmationEmailToken.data.token,
        },
        {
          mailer: tools.mailer,
        }
      );
    });
  }

  public async singIn(
    data: { email: string; password: string },
    context: Context
  ) {
    return this.db.transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          emails: [data.email],
        },
      });

      if (!user) {
        throw new NotFoundError("user not found");
      }

      if (!user.data.emailConfirmedAt) {
        throw new AppError(
          "email address not confirmed",
          409,
          ERROR_CODES.UNCONFIRMED_EMAIL
        );
      }

      const password = await user.passwords.findFirst();

      if (!password) {
        throw new NotFoundError("password not found");
      }

      const isPasswordCorrect = await this.compareHash({
        password: data.password,
        hashedPassword: password.data.password,
      });

      if (!isPasswordCorrect) {
        throw new AppError("password not correct", 409, "incorrect_password");
      }

      const session = await user.sessions.createFirst([{}]);

      this.setSessionCookie(context, session.data.session);
    });
  }

  public async getAuthUser(
    context: Context
  ): Promise<{ auth: { user: UserInstance; session: SessionInstance } }> {
    return this.db.transaction(async (tx) => {
      const rawSession = this.getSessionCookie(context);

      if (!rawSession) {
        throw new UnauthenticatedError();
      }

      const session = await tx.session.findFirst({
        where: {
          sessions: [rawSession],
        },
      });

      if (!session) {
        throw new UnauthenticatedError();
      }

      const user = await session.user.findFirst();

      if (!user) {
        throw new Error("user should exist");
      }

      return {
        auth: {
          user,
          session,
        },
      };
    });
  }

  public async confirmEmail(data: { token: string }) {
    return this.db.transaction(async (tx) => {
      const tokenInstance = await tx.tokens.findFirst({
        where: {
          tokens: [data.token],
        },
      });

      if (!tokenInstance) {
        throw new AppError("invalid token", 409, "invalid_token");
      }

      const halfADay = 12 * 60 * 60 * 1000;
      const tokenExpiry = tokenInstance.data.createdAt.getTime() + halfADay;

      const now = new Date();
      const nowInMS = now.getTime();

      if (tokenExpiry < nowInMS) {
        throw new AppError("token expired", 409, "expired_token");
      }

      const user = await tokenInstance.user.findFirst();

      if (!user) {
        throw new Error("email confirmation token cannot exist without a user");
      }

      user.data.emailConfirmedAt = now;

      await Promise.all([tokenInstance.remove(), user.save()]);
    });
  }

  public async signOut(data: { session: SessionInstance }) {
    return this.db.transaction(async (tx) => {
      const session = new SessionInstance(data.session.data, tx.db);
      await session.remove();
    });
  }

  public sendPasswordResetEmail(
    data: { email: string; token: string },
    tools: { mailer: BaseMailer }
  ) {
    return tools.mailer.sendMail({
      from: "auth",
      to: [data.email],
      subject: "Reset password",
      html: `<a href="${new URL(`/reset-password?token=${data.token}`, env.VITE_CLIENT_URL).toString()}" >Reset password</a>`,
    });
  }

  public async forgotPassword(
    data: { email: string },
    tools: { mailer: BaseMailer }
  ) {
    return this.db.transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          emails: [data.email],
        },
      });

      if (!user) {
        throw new NotFoundError("user not found");
      }

      const token = await user.tokens.createFirst([
        {
          type: "reset-password",
        },
      ]);

      await this.sendPasswordResetEmail(
        {
          email: data.email,
          token: token.data.token,
        },
        {
          mailer: tools.mailer,
        }
      );
    });
  }

  public async resetPassword(data: { token: string; password: string }) {
    return this.db.transaction(async (tx) => {
      const token = await tx.tokens.findFirst({
        where: {
          tokens: [data.token],
        },
      });

      if (!token) {
        throw new AppError(
          "password can not be reset, try again later",
          409,
          "reset_password"
        );
      }

      const now = new Date();
      const nowInMS = now.getTime();

      const twelveHours = 12 * 60 * 60 * 1000;
      const tokenExpiresAt = token.data.createdAt.getTime() + twelveHours;

      if (tokenExpiresAt < nowInMS) {
        throw new AppError("token expired", 409, "token_expired");
      }

      const user = await token.user.findFirstOrThrow();

      await Promise.all([user.passwords.remove(), token.remove()]);

      const hashedPassword = await this.hashPassword({
        password: data.password,
      });

      await user.passwords.create([
        {
          password: hashedPassword,
        },
      ]);
    });
  }

  public updateProfile(
    data: {
      firstName: string;
      lastName: string;
      auth: UserInstance;
      avatar: File | null;
    },
    tools: {
      storage: BaseStorage;
    }
  ) {
    return this.db.transaction(async (tx) => {
      const user = new UserInstance(data.auth.data, tx.db);

      user.data.firstName = data.firstName;
      user.data.lastName = data.lastName;

      if (!data.avatar) {
        await user.save();
        return;
      }

      const { key } = await tools.storage.upload({
        file: data.avatar,
      });

      user.data.avatar = key;
      await user.save();
    });
  }

  public updatePassword(
    data: {
      currentPassword: string;
      newPassword: string;
    },
    authUser: UserInstance
  ) {
    return this.db.transaction(async (tx) => {
      const user = new UserInstance(authUser.data, tx.db);
      const password = await user.passwords.findFirstOrThrow();

      const match = await this.compareHash({
        password: data.currentPassword,
        hashedPassword: password.data.password,
      });

      if (!match) {
        throw new AppError(
          "password is not correct",
          409,
          "password_incorrect"
        );
      }

      await user.passwords.remove();

      const hashedPassword = await this.hashPassword({
        password: data.newPassword,
      });

      await user.passwords.createFirst([
        {
          password: hashedPassword,
        },
      ]);
    });
  }

  public requestChangeEmailAddress(
    data: { email: string; password: string; auth: UserInstance },
    tools: {
      mailer: BaseMailer;
    }
  ) {
    return this.db.transaction(async (tx) => {
      const user = new UserInstance(data.auth.data, tx.db);
      const password = await user.passwords.findFirstOrThrow();

      const match = await this.compareHash({
        password: data.password,
        hashedPassword: password.data.password,
      });

      if (!match) {
        throw new AppError("incorrect password", 409, "incorrect_password");
      }

      {
        const user = await tx.user.findFirst({
          where: {
            emails: [data.email],
          },
        });

        if (user) {
          throw new AlreadyExistsError("email address is taken");
        }
      }

      const token = await user.tokens.createFirst([
        {
          type: "change-email",
          payload: {
            email: data.email,
          },
        },
      ]);

      await this.sendChangeEmailAddress(
        {
          email: data.email,
          token: token.data.token,
        },
        {
          mailer: tools.mailer,
        }
      );
    });
  }

  public checkTokenExpired(token: TokenInstance, duration: number = 43200000) {
    const now = new Date();
    const nowInMs = now.getTime();

    const expiresAt = token.data.createdAt.getTime() + duration;

    return expiresAt < nowInMs;
  }

  public async changeEmailAddress(data: { token: string }) {
    return this.db.transaction(async (tx) => {
      const token = await tx.tokens.findFirstOrThrow({
        where: {
          tokens: [data.token],
        },
      });

      if (token.data.type !== "change-email") {
        throw new AppError("invalid token", 409, "invalid_token");
      }

      if (this.checkTokenExpired(token)) {
        throw new AppError("token expired", 409, "invalid_token");
      }

      const user = await token.user.findFirst();

      if (!user) {
        throw new Error("token can not exists without a user");
      }

      const { email } = token.data.payload as {
        email: string;
      };

      user.data.email = email;

      await user.save();
    });
  }
}
