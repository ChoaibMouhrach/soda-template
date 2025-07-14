import fs from "fs";
import S3rver from "s3rver";
import { log } from "console";

const port = 9000;
const address = "0.0.0.0";

const s3 = new S3rver({
  port,
  address,
  directory: "./s3",
  configureBuckets: [
    {
      name: "storage",
      configs: [fs.readFileSync("./cors.xml")],
    },
  ],
});

log(`The server is running on ${address}:${port}`);

s3.run();
