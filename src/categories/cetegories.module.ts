import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "../users/user.module";
import {CategoriesEntity} from "../entities/categories.entity";
import {CategoriesController} from "./cetegories.controller";
import {CategoriesService} from "./cetegories.service";
import {CategoriesManagerEntity} from "../entities/categoriesManager.entity";


@Module({
    controllers: [CategoriesController],
    providers: [
        CategoriesService,
    ],
    imports: [
        TypeOrmModule.forFeature([CategoriesEntity, CategoriesManagerEntity]),
        UsersModule
    ],
    exports: [CategoriesService]
})
export class CategoriesModule {
}
