import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async getCache<T>(
    key: string,
    functionRequest: () => Promise<any>,
  ): Promise<any> {
    const allData: any = await this.cacheManager.get(key);

    if (allData) {
      return allData;
    }

    const cities: any = await functionRequest();

    await this.cacheManager.set(key, cities);

    return cities;
  }
}
