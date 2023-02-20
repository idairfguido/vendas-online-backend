import { CacheModule as CacheModuleNest, Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { CacheModule } from 'src/cache/cache.module';
import { CityService } from './city.service';
@Module({
  imports: [
    CacheModuleNest.register({
      ttl: 900000000,
    }),
    CacheModule,
    TypeOrmModule.forFeature([CityEntity]),
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
