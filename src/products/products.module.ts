import {Module} from '@nestjs/common';
import {ProductsService} from "./products.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "../users/user.module";
import {ProductsEntity} from "../entities/products.entity";
import {ProductsController} from "./products.controller";
import {CategoriesModule} from "../categories/cetegories.module";
import {CategoriesEntity} from "../entities/categories.entity";
import {ProductsManagerEntity} from "../entities/productsManager.entity";


@Module({
    controllers: [ProductsController],
    providers: [
        ProductsService,
    ],
    imports: [
        TypeOrmModule.forFeature([ProductsEntity, CategoriesEntity, ProductsManagerEntity]),
        UsersModule,
        CategoriesModule

    ],
    exports: [
        ProductsService
    ]
})
export class ProductsModule{

}