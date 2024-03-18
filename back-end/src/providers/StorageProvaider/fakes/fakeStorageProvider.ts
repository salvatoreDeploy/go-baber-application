import { IStorageProvaider } from "../models/IStorageProvaider";

class FakeStorageProvider implements IStorageProvaider {
  private storage: string[] = [];

  async save(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  async delete(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      (storageFile) => storageFile === file
    );

    this.storage.splice(findIndex, 1);
  }
}

export { FakeStorageProvider };
