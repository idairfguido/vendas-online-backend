import { CacheModule, Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';

@Module({
  imports: [
    CacheModule.register({
      ttl: 900000000,
    }),
    TypeOrmModule.forFeature([CityEntity]),
  ],
  providers: [CityService],
  controllers: [CityController],
})
export class CityModule {}
