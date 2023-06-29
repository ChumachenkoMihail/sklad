import { Module } from '@nestjs/common';
import {StockController} from "./stock.controller";
import {StockService} from "./stock.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockEntity} from "../entities/stock.entity";
import {UsersModule} from "../users/user.module";
import {StockManagersEntity} from "../entities/stockManagers.entity";
import {StockProductsEntity} from "../entities/stockProducts.entity";
import {ProductsEntity} from "../entities/products.entity";


@Module({
    controllers: [StockController],
    providers: [
        StockService,
    ],
    imports: [
        TypeOrmModule.forFeature([StockEntity, StockManagersEntity, StockProductsEntity, ProductsEntity]),
        UsersModule
    ],
    exports: [StockService]
})
export class StockModule {}
