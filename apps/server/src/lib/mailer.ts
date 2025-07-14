import { Resend } from "resend";

interface SendMailPayload<From extends string> {
  from: From extends `${string}@${string}` ? never : From;
  to: string[];
  subject: string;
  html: string;
}

export abstract class BaseMailer {
  protected domain;

  public constructor(config: { domain: string }) {
    this.domain = config.domain;
  }

  public abstract sendMail<From extends string>(
    payload: SendMailPayload<From>
  ): Promise<void>;
}

export class ResendMailer extends BaseMailer {
  private client;

  public constructor(config: { domain: string; resendToken: string }) {
    super({
      domain: config.domain,
    });

    this.client = new Resend(config.resendToken);
  }

  public async sendMail<From extends string>(payload: SendMailPayload<From>) {
    const response = await this.client.emails.send({
      from: payload.from + "@" + this.domain,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    if (!response.error) {
      return;
    }

    throw new Error(response.error.message);
  }
}

export class DevMailer extends BaseMailer {
  public async sendMail<From extends string>(payload: SendMailPayload<From>) {
    console.log(JSON.stringify(payload, null, 4));
  }
}
