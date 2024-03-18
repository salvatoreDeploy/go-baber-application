import { Redis } from "ioredis";
import { injectable } from "inversify";
import cacheConfig from '@config/Cache'
import ICacheProvider from "../models/ICacheProvider";
import ICacheProviderDTO from "../dtos/ICacheProviderDTO";

@injectable()
export default class RedisCacheProvaider implements ICacheProvider {
  private client: Redis;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`)

    const pipeline = this.client.multi()

    keys.forEach(key => {
      pipeline.del(key)
    })

    await pipeline.exec()
  }

  async save({ key, value }: ICacheProviderDTO): Promise<void> {
    await this.client.set(key, JSON.stringify(value))
  }

  async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key)

    if (!data) {
      return null
    }

    const parsedData = JSON.parse(data) as T

    return parsedData
  }
  
  async invalidate(key: string): Promise<void> {
    const pipeline = this.client.multi(); // Usando multi para transação atômica

    pipeline.del(key)
   
    await pipeline.exec();
  }
}