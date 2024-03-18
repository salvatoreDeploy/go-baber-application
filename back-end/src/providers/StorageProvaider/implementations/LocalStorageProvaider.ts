import fs from "fs";
import { resolve } from "path";
import { IStorageProvaider } from "../models/IStorageProvaider";
import Upload from "@config/Upload";
import { injectable } from "inversify";

@injectable()
class LocalStorageProvaider implements IStorageProvaider {
  async save(file: string): Promise<string> {
    await fs.promises.rename(
      resolve(Upload.tmpFolder, file),
      resolve(`${Upload.uploadsFolder}`, file)
    );

    return file;
  }

  async delete(file: string): Promise<void> {
    const avatarFileName = resolve(`${Upload.uploadsFolder}`, file);

    try {
      await fs.promises.stat(avatarFileName);
    } catch {
      return;
    }
    await fs.promises.unlink(avatarFileName);
  }
}

export { LocalStorageProvaider };
