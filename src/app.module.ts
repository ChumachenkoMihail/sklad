import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {config} from "dotenv";
import {AuthModule} from "./auth/auth.module";
import {StockModule} from "./stock/stock.module";
import {ProductsModule} from "./products/products.module";
import {CategoriesModule} from "./categories/cetegories.module";


config()
@Module({
  imports: [
    TypeOrmModule.forRoot(
        {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: JSON.parse(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: true,
            entities: ['dist/**/*.entity{.ts,.js}'],
            // logging: true
        }
    ),
      AuthModule,
      StockModule,
      ProductsModule,
      CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
