import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import {ProductsEntity} from "../entities/products.entity";
import {CreateProductDto} from "./dto/createProduct.dto";
import {UpdateProductDto} from "./dto/updateProduct.dto";
import {CategoriesService} from "../categories/cetegories.service";
import {ProductsManagerEntity} from "../entities/productsManager.entity";


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductsEntity)
        private readonly productsRepository: Repository<ProductsEntity>,
        @InjectRepository(ProductsManagerEntity)
        private readonly productsManagerRepository: Repository<ProductsManagerEntity>,

        private usersService: UsersService,
        private categoriesService: CategoriesService,
    ) {
    }

    async createProduct(body: CreateProductDto, userId: number) {
        const ifProductExists = await this.getProductByVendorCode(body.vendorCode, userId);
        if (ifProductExists) {
            throw new BadRequestException('Product with vendor code already exists')
        }
        const user = await this.usersService.findUserById(userId);
        const newProduct = new ProductsEntity();
        newProduct.name = body.name;
        newProduct.vendorCode = body.vendorCode;
        newProduct.description = body.description;
        newProduct.user = user;
        newProduct.properties = body.properties;
        newProduct.image = body.image;
        newProduct.price = Number(body.price);
        if (body.categoryId) {
            const ifCategoryExists = await this.categoriesService.getCategoryById(body.categoryId, userId);
            if (!ifCategoryExists) {
                throw new BadRequestException('No required category id')
            }
            newProduct.category = ifCategoryExists;
        }
        const createdProduct = await this.productsRepository.save(newProduct);
    console.log('we are here');
        const newManager = new ProductsManagerEntity();
        newManager.product_id = createdProduct.id;
        newManager.user = user;
        await this.productsManagerRepository.save(newManager);
        console.log('we are here2');

        return createdProduct
    }

    async getProductByVendorCode(vendorCode, userId) {
       const product = await this.productsRepository.findOne({
            where: {
                vendorCode
            }
        })
        if(!product){
            return ;
        }

        const manager = await this.productsManagerRepository.findOne({
            where: {
                product_id: product.id,
                user_id: userId
            }
        })
        if(!manager){
            return ;
        }
        return product;
    }

    async getProductById(id, userId) {
        const manager = await this.productsManagerRepository.findOne({
            where: {
                product_id: id,
                user_id: userId
            }
        })
        if(!manager){
            throw new BadRequestException('Product with current id does not exists');
        }

        const product: any =  await this.productsRepository.findOne({
            select: ['id','name','description', 'properties', 'image', 'vendorCode', 'price', 'category'],
            relations: {category: true},
            where: {
                id
            }
        })
        if(product?.category){
            const fullCategory = await this.categoriesService.getFullCategoryName(product.category.id, userId);
            product.fullCategoryName = fullCategory;
        }
        return product;
    }

    async getProductByIdOwner(id, userId) {
        const product: any =  await this.productsRepository.findOne({
            // select: ['id','name','description', 'properties', 'image', 'vendorCode', 'price', 'category'],
            select: ['id','name','description', 'properties', 'image', 'vendorCode', 'price'],
            // relations: {category: true},
            where: {
                id
            }
        })
        if(product?.category){
            const fullCategory = await this.categoriesService.getFullCategoryName(product.category.id, userId);
            product.fullCategoryName = fullCategory;
        }
        console.log(product);
        return product;
    }

    async updateProduct(productId, body: UpdateProductDto, userId) {

        const ifProductWithIdExists = await this.getProductById(productId, userId);
        if (!ifProductWithIdExists) {
            throw new BadRequestException('Product with current id does not exists');
        }
    console.log(body.categoryId);
        const ifStockWithNewNameExists = await this.getProductByVendorCode(body.vendorCode, userId);
        if (ifStockWithNewNameExists) {
            throw new BadRequestException('Product with vendor code already exists');
        }
        if(body.categoryId){
            const ifCategoryExists = await this.categoriesService.getCategoryById(body.categoryId, userId);
            if (!ifCategoryExists) {
                throw new BadRequestException('No required category id')
            }
        }
        if (body.name) {
            await this.productsRepository.update({
                id: ifProductWithIdExists.id
            }, {
                name: body.name,
            })
        }

        if (body.properties) {
            await this.productsRepository.update({
                id: ifProductWithIdExists.id
            }, {
                properties: body.properties,
            })
        }

        if (body.description) {
            await this.productsRepository.update({
                id: ifProductWithIdExists.id
            }, {
                description: body.description,
            })
        }

        if (body.vendorCode) {
            await this.productsRepository.update({
                id: ifProductWithIdExists.id
            }, {
                vendorCode: body.vendorCode,
            })
        }
        if (body.price) {
            await this.productsRepository.update({
                id: ifProductWithIdExists.id
            }, {
                price: body.price,
            })
        }

        if (body.categoryId) {
            await this.productsRepository.update({
                id: ifProductWithIdExists.id
            }, {
                //@ts-ignore
                category: ifCategoryExists,
            })
        }
        if (body.image) {
            await this.productsRepository.update({
                id: ifProductWithIdExists.id
            }, {
                image: body.image,
            })
        }
        return {message: 'Success'};
    }

    async deleteProduct(productId, userId) {
        const ifStockWithIdExists = await this.getProductByIdOwner(productId, userId);
        console.log(ifStockWithIdExists);
        if (!ifStockWithIdExists) {
            throw new BadRequestException('Product with current id does not exists');
        }

        return await this.productsRepository.delete({
            id: productId
        })
    }

    async getUserProducts(userId) {
        const products = await this.productsManagerRepository.createQueryBuilder('products')
            .where("user_id = :id", {id : userId})
            .getMany()
        // console.log(products);
        const productsIds = new Set();
        products.map(products => {
            productsIds.add(products.product_id);
        })
        const stockIdsArray = Array.from(productsIds);

        const productIdsRaw = await this.productsRepository.find({
            relations: {user: true},
            where: {
                id: In(stockIdsArray)
            }
        })
        // console.log(productIdsRaw);

        productIdsRaw.map(ids => {
            console.log(ids.properties);
            // console.log(ids);
            if(ids?.properties){
                ids.properties = JSON.stringify(ids.properties[0])
            }
        })

        return productIdsRaw
    }
}