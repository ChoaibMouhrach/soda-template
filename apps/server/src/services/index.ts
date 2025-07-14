import { AppService } from "./app";
import { AuthService } from "./auth";
import type { Database } from "@server/repos";
import { OAuthService } from "./oauth";

export class Service {
  public auth;
  public app;
  public oauth;

  public constructor(db: Database) {
    this.auth = new AuthService(db);
    this.app = new AppService(db);
    this.oauth = new OAuthService(db);
  }
}
