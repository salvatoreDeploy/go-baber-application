import fs from "fs";
import path from "path";
import { resolve } from "path";
import { IStorageProvaider } from "../models/IStorageProvaider";
import Upload from "@config/Upload";
import { injectable } from "inversify";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { r2 } from "../../../utils/cloudFlare";
import { randomUUID } from "crypto";
import mime from "mime";

@injectable()
class CloudFlareStorageProvaider implements IStorageProvaider {
  async save(file: string): Promise<string> {
    const originalPath = path.resolve(Upload.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalPath, {
      encoding: null,
    });

    /* const fileKey = randomUUID().concat('-').concat(String(fileContent)) */

    /* const fileData = Buffer.from(fileContent).buffer; */

    /* const fileT = new Uint8Array(fileData); */

    const fileType = mime.getType(originalPath);

    if (!fileType) {
      throw new Error("File does not exists");
    }

    await r2.send(
      new PutObjectCommand({
        Bucket: Upload.config.cloudFlare.bucket,
        Key: file,
        ACL: "public-read",
        Body: fileContent,
        ContentType: fileType,
      })
    );

    await fs.promises.unlink(originalPath)

    return file;
  }

  async delete(file: string): Promise<void> {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: Upload.config.cloudFlare.bucket,
        Key: file,
      })
    );
  }
}

export { CloudFlareStorageProvaider };
