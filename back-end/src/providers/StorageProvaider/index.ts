import Upload from "@config/Upload";
import { CloudFlareStorageProvaider } from "./implementations/CloudFlareStorageProvaider";
import { LocalStorageProvaider } from "./implementations/LocalStorageProvaider";
import IStorageProvaider from "./models/IStorageProvaider";

const providerMap: { [key: string]: new () => IStorageProvaider } = {

  'disk': LocalStorageProvaider,
  'cloudFlare': CloudFlareStorageProvaider,
};

export const selectedProviderStorage = providerMap[Upload.driver] || LocalStorageProvaider;




