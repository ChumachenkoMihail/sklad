import {Module} from "@nestjs/common";
import {InvitesController} from "./invites.controller";
import {InvitesService} from "./invites.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "../users/user.module";
import {MembersEntity} from "../entities/members.entity";
import {CategoriesModule} from "../categories/cetegories.module";
import {StockModule} from "../stock/stock.module";
import {ProductsModule} from "../products/products.module";
import {ProductsManagerEntity} from "../entities/productsManager.entity";
import {StockManagersEntity} from "../entities/stockManagers.entity";
import {CategoriesManagerEntity} from "../entities/categoriesManager.entity";


@Module({
    controllers: [InvitesController],
    providers: [InvitesService],
    imports: [
        TypeOrmModule.forFeature([MembersEntity, ProductsManagerEntity, StockManagersEntity, CategoriesManagerEntity]),
        UsersModule,
        CategoriesModule,
        StockModule,
        ProductsModule
    ],
    exports: [],
})
export class InvitesModule{
}