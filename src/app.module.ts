import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/interfaces/user.entity';
import { createTableUser1675388649812 } from './migration/1676517261781-create_table_user';
import { createTableState1675388988978 } from './migration/1676518738552-create_table_state';
import { createTableCity1675388992280 } from './migration/1676518769226-create_table_city';
import { createTableAddress1675388996374 } from './migration/1676518789581-create_table_address';

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
      entities: [UserEntity],
      migrations: [
        createTableUser1675388649812,
        createTableState1675388988978,
        createTableCity1675388992280,
        createTableAddress1675388996374,
      ],
      migrationsRun: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
