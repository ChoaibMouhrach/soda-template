import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env";

export abstract class BaseStorage {
  public abstract upload(options: { file: File }): Promise<{
    key: string;
  }>;
}

export class S3Storage extends BaseStorage {
  private client;
  private bucket;

  public constructor(options: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
  }) {
    super();
    this.bucket = options.bucket;

    this.client = new S3Client({
      region: env.SERVER_AWS_REGION,
      endpoint:
        Bun.env.NODE_ENV !== "production"
          ? new URL(env.VITE_STORAGE_URL).origin
          : undefined,
      forcePathStyle: Bun.env.NODE_ENV !== "production",
      credentials: {
        accessKeyId:
          Bun.env.NODE_ENV === "production"
            ? env.SERVER_AWS_ACCESS_KEY_ID
            : "S3RVER",
        secretAccessKey:
          Bun.env.NODE_ENV === "production"
            ? env.SERVER_AWS_SECRET_ACCESS_KEY
            : "S3RVER",
      },
    });
  }

  public async upload(options: { file: File }) {
    const extension = options.file.name.split(".").at(-1);
    const key = crypto.randomUUID() + "." + extension;

    const fileBuffer = Buffer.from(await options.file.arrayBuffer());

    const command = new PutObjectCommand({
      Key: key,
      Body: fileBuffer,
      Bucket: this.bucket,
      ContentType: options.file.type,
    });

    await this.client.send(command);

    return {
      key,
    };
  }
}
