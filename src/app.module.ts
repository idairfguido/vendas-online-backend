import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { createTableUser1675388649812 } from './migration/1676517261781-create_table_user';
import { createTableState1675388988978 } from './migration/1676518738552-create_table_state';
import { createTableCity1675388992280 } from './migration/1676518769226-create_table_city';
import { createTableAddress1675388996374 } from './migration/1676518789581-create_table_address';
import { alterTableState1675458729381 } from './migration/1676588667751-alter-table-state';
import { insertInState1675458748572 } from './migration/1676588695806-insert-in-state';
import { insertInCity1675458752231 } from './migration/1676588712477-insert-in-city';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AddressModule } from './address/address.module';
import { StateEntity } from './state/entities/state.entity';
import { CityEntity } from './city/entities/city.entity';
import { AddressEntity } from './address/entities/address.entity';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      entities: [UserEntity, StateEntity, CityEntity, AddressEntity],
      migrations: [
        createTableUser1675388649812,
        createTableState1675388988978,
        createTableCity1675388992280,
        createTableAddress1675388996374,
        alterTableState1675458729381,
        insertInState1675458748572,
        insertInCity1675458752231,
      ],
      migrationsRun: true,
    }),
    UserModule,
    StateModule,
    CityModule,
    AddressModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
