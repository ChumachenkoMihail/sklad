import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StockEntity} from "../entities/stock.entity";
import {In, Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import {CreateStockDto} from "./dto/createStock.dto";
import {UpdateStockDto} from "./dto/updateStock.dto";
import {StockManagersEntity} from "../entities/stockManagers.entity";
import {ProductsEntity} from "../entities/products.entity";
import {StockProductsEntity} from "../entities/stockProducts.entity";


@Injectable()
export class StockService {
    constructor(
        @InjectRepository(StockEntity)
        private readonly stockRepository: Repository<StockEntity>,

        @InjectRepository(StockProductsEntity)
        private readonly stockProductsRepository: Repository<StockProductsEntity>,

        @InjectRepository(ProductsEntity)
        private readonly productsRepository: Repository<ProductsEntity>,

        @InjectRepository(StockManagersEntity)
        private readonly stockManagersEntity: Repository<StockManagersEntity>,

        private usersService: UsersService
    ) {
    }

    async createStock(body: CreateStockDto, userId: number) {
        const ifStockExists = await this.getStockByName(body.name, userId);
        if(ifStockExists){
            throw new BadRequestException('Склад з такою назвою вже існує')
        }
        const user = await this.usersService.findUserById(userId);

        const newStock = new StockEntity();
        newStock.name = body.name;
        newStock.address = body.address;
        newStock.description = body.description;
        newStock.user = user;
        newStock.total = 0;
        const createdStock = await this.stockRepository.save(newStock);

        const newManager = new StockManagersEntity();
        newManager.stock_id = createdStock.id;
        newManager.user = user;
        await this.stockManagersEntity.save(newManager);

        return createdStock;
    }

    async updateStock(stockId: number, body: UpdateStockDto, userId: number){
        const ifStockWithIdExists = await this.getStockById(stockId, userId);
        if(!ifStockWithIdExists){
            throw new BadRequestException('Такого складу не існує');
        }

        const ifStockWithNewNameExists = await this.getStockByName(body.name, userId);
        if(ifStockWithNewNameExists){
            throw new BadRequestException('Склад з такою назвою вже існує');
        }
        if(body.name){
            await this.stockRepository.update({
                id: ifStockWithIdExists.id
            }, {
                name: body.name,
            })
        }

        if(body.address){
            await this.stockRepository.update({
                id: ifStockWithIdExists.id
            }, {
                address: body.address,
            })
        }

        if(body.description){
            await this.stockRepository.update({
                id: ifStockWithIdExists.id
            }, {
                description: body.description,
            })
        }
        return { message: 'Success'};
    }

    async deleteStock(stockId: number, userId: number){
        const ifStockWithIdExists = await this.getStockByIdOwner(stockId, userId);
        if(!ifStockWithIdExists){
            throw new BadRequestException('Stock with current id does not exists');
        }

        return await this.stockRepository.delete({
            id: stockId
        })
    }
    async getUserStocks(userId: number){
        const stocks = await this.stockManagersEntity.createQueryBuilder('stocks')
            .where("user_id = :id", {id : userId})
            .getMany()
        const stockIds = new Set();
        stocks.map(stock => {
            stockIds.add(stock.stock_id);
        })
        const stockIdsArray = Array.from(stockIds);
        return await this.stockRepository.find({
            relations: {user: true},
            where: {
                id: In(stockIdsArray)
            }
        })
    }

    async getStockByIdOwner(id: number, userId: number){
        return await this.stockRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId
                }
            }
        })
    }

    async getStockById(id: number, userId: number){
        const manager = await this.stockManagersEntity.findOne({
            where: {
                stock_id: id,
                user_id: userId
            }
        })
        if(!manager){
            return ;
        }

        return await this.stockRepository.findOne({
            where: {
                id: id
            }
        })
    }

    async getStockWithProducts(id: number, userId: number){
        const manager = await this.stockManagersEntity.findOne({
            where: {
                stock_id: id,
                user_id: userId
            }
        })
        if(!manager){
            return ;
        }

        const stock = await this.stockRepository.findOne({
            where: {
                id: id
            }
        })
        const productIdsRaw = await this.stockProductsRepository.find({
            relations: ['product'],
            where: {
                stock_id: stock.id
            }
        })
        productIdsRaw.map(ids => {
            ids.product.properties = JSON.stringify(ids.product.properties[0])
        })
        return {stock: stock, products: productIdsRaw}
    }

    async changeProductCount(stock_id: number, product_id: number, newCount: number){
        return await this.stockProductsRepository.update(
            {
                stock_id: stock_id,
                product_id: product_id,
            },
            {count: newCount}
        )
    }

    async deleteProduct(stock_id: number, product_id: number){
        return await this.stockProductsRepository.delete({
            stock_id: stock_id,
            product_id: product_id,
        })
    }

    async getStockByName(name: string, userId : number){
        return await this.stockRepository.findOne({
            where: {
                name,
                user: {
                    id: userId
                }
            }
        })
    }
}