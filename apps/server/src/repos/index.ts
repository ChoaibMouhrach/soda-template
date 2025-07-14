import { UserRepo } from "./user";
import type { DB } from "@server/db";
import { SessionRepo } from "./session";
import { TokenRepo } from "@server/repos/token";
import { AppRepo } from "./app";
import { AppSecretRepo } from "./app-secret";
import { AppRedirectUrlRepo } from "./app-redirect-urls";

export class Database {
  public db;
  public user;
  public session;
  public tokens;
  public apps;
  public secrets;
  public appRedirectUrls;

  public constructor(db: DB) {
    this.db = db;

    this.user = new UserRepo(db, undefined);
    this.tokens = new TokenRepo(db, undefined);
    this.session = new SessionRepo(db, undefined);

    this.apps = new AppRepo(db, {
      userId: undefined,
    });

    this.secrets = new AppSecretRepo(db, {
      appId: undefined,
    });

    this.appRedirectUrls = new AppRedirectUrlRepo(db, {
      appId: undefined,
    });
  }

  public async transaction<T>(callback: (database: Database) => Promise<T>) {
    return this.db.transaction(async (tx) => {
      return callback(new Database(tx));
    });
  }
}
