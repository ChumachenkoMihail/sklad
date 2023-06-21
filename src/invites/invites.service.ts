import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CategoriesEntity} from "../entities/categories.entity";
import {Repository} from "typeorm";
import {MembersEntity} from "../entities/members.entity";
import {UsersService} from "../users/users.service";
import {StockService} from "../stock/stock.service";
import {CategoriesService} from "../categories/cetegories.service";
import {ProductsService} from "../products/products.service";
import {StockEntity} from "../entities/stock.entity";
import {StockManagersEntity} from "../entities/stockManagers.entity";
import {ProductsManagerEntity} from "../entities/productsManager.entity";
import {CategoriesManagerEntity} from "../entities/categoriesManager.entity";


@Injectable()
export class InvitesService{

    constructor(
        @InjectRepository(MembersEntity)
        private readonly membersRepository: Repository<MembersEntity>,

        @InjectRepository(StockManagersEntity)
        private readonly stockManagersRepository: Repository<StockManagersEntity>,
        @InjectRepository(ProductsManagerEntity)
        private readonly productsManagerRepository: Repository<ProductsManagerEntity>,
        @InjectRepository(CategoriesManagerEntity)
        private readonly categoriesManagerRepository: Repository<CategoriesManagerEntity>,

        private usersService: UsersService,
        private stockService: StockService,
        private categoriesService: CategoriesService,
        private productsService: ProductsService

    ) {
    }

    async addMember(email: string, userId: number){
        const existUser = await this.usersService.findUserByEmail(email);
        // if(!existUser){
        //     throw new BadRequestException('User with current email does not exist');
        // }

        // const existMember = await this.membersRepository.findOne({
        //     where: {
        //         owner: {
        //             id: userId
        //         },
        //         member: {
        //             id: existUser.id
        //         }
        //     }
        // })
        // if(existMember){
        //     throw new BadRequestException('Member already added');
        // }
        //
        // const owner = await this.usersService.findUserById(userId);
        //
        // const newMember = new MembersEntity();
        // newMember.owner = owner;
        // newMember.member = existUser;
        // await this.membersRepository.save(newMember);
        //
        // const ownerStocks = await this.stockService.getUserStocks(userId);
        // const insertStock = [];
        // ownerStocks.map(stock => {
        //     insertStock.push({stock_id:  stock.id, user_id: existUser.id})
        // })
        // await this.stockManagersRepository.createQueryBuilder()
        // .insert()
        // .into(StockManagersEntity)
        //     .values(insertStock)
        //     .execute()
        //
        // const ownerProducts = await this.productsService.getUserProducts(userId);
        // const insertProducts = [];
        // ownerProducts.map(product => {
        //     insertProducts.push({product_id:  product.id, user_id: existUser.id})
        // })
        // await this.productsManagerRepository.createQueryBuilder()
        //     .insert()
        //     .into(ProductsManagerEntity)
        //     .values(insertProducts)
        //     .execute()

        console.log(userId);
        const ownerCategories = await this.categoriesService.getUserCategories(userId);
        console.log(ownerCategories);
        const insertCategories = [];
        //@ts-ignore
        ownerCategories.map(category => {
            insertCategories.push({category_id:  category.id, user_id: existUser.id})
        })
        await this.productsManagerRepository.createQueryBuilder()
            .insert()
            .into(ProductsManagerEntity)
            .values(insertCategories)
            .execute()



        return { message: 'Success'};

    }


}