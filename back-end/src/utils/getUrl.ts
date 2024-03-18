import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "./cloudFlare";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import Upload from "@config/Upload";

export async function getUrlImage(file: string) {

  const urlImage = await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: Upload.config.cloudFlare.bucket, Key: file })
  );

  return urlImage;
}
