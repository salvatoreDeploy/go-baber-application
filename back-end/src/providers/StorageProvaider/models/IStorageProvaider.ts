export default interface IStorageProvaider {
  save(file: string): Promise<string>;
  delete(file: string): Promise<void>;
}

export { IStorageProvaider };
