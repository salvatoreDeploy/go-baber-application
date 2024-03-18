import path from "path";
import multer, { StorageEngine } from "multer";
import crypto from "crypto";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

interface IUploadDriver {
  driver: "cloudFlare" | "disk";
  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    cloudFlare: {
      bucket: string
    }
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, "uploads"),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename: (request, file, callback) => {

        const sanitizedName = file.originalname.replace(/[^\w.-]+/g, '')

        const fileHash = crypto.randomBytes(16).toString("hex");
        const filename = `${fileHash}-${sanitizedName}`;

        return callback(null, filename);
      },
    }),
  },

  config: {
      disk: {},
      cloudFlare: {
        bucket: 'go-barber'
      }
  },
} as IUploadDriver;
