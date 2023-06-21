import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {In, IsNull, Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import {CreateCategoryDto} from "./dto/createCategory.dto";
import {CategoriesEntity} from "../entities/categories.entity";
import {UpdateCategoryDto} from "./dto/updateCategory.dto";
import {CategoriesManagerEntity} from "../entities/categoriesManager.entity";


@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoriesEntity)
        private readonly categoriesRepository: Repository<CategoriesEntity>,

        @InjectRepository(CategoriesManagerEntity)
        private readonly categoriesManagerEntity: Repository<CategoriesManagerEntity>,
        private usersService: UsersService
    ) {
    }

    async getUserCategories(userId: number){
        return await this.categoriesRepository.createQueryBuilder()
            .where("userId = :id", {id : userId})
            .getMany()
        // await this.categoriesRepository.findOne({
        //     relations: {user: true},
        //     where: {
        //         user: {
        //             id: 1
        //         }
        //     }
        // })
    }

    async getFirstCategories(userId: number) {
        console.log(userId);
        const existCategories = await this.categoriesManagerEntity.find({
            where: {
                user_id: userId
            }
        })
        if(!existCategories){
            throw new BadRequestException('Category with id not found')
        }
        let ids = [];
        existCategories.map(category => {
            ids.push(+category.id)
        })
        console.log(ids);

        return await this.categoriesRepository.find({
            where: {
                id: In(ids),
                parent: IsNull()
            }
        })
    }

    async getCategoryChildren(categoryId: number, userId: number) {
        const existCategory = await this.categoriesManagerEntity.findOne({
            where: {
                category_id: categoryId,
                user_id: userId

            }
        })
        if(!existCategory){
            throw new BadRequestException('Category with id not found')
        }
        return await this.categoriesRepository.find({
            where: {
                parent: { id: categoryId }
            }
        })
    }

    async getAllCategoryChildren(categoryId: number, userId: number) {
        const existCategory = await this.categoriesManagerEntity.findOne({
            where: {
                category_id: categoryId,
                user_id: userId

            }
        })
        if(!existCategory){
            throw new BadRequestException('Category with id not found')
        }
        let result = [];
        const children = await this.categoriesRepository.find({
            where: {
                parent: {id: categoryId}
            }
        })
        for (const child in children) {
            let temp: any = {...children[child]};
            temp.children = [];
            const c = await this.getAllCategoryChildren(children[child].id, userId);
            console.log(c);
            temp.children = c;
            result.push(temp);
        }
        return result
    }

    async getFullCategories(userId: number) {
        let result = [];
        const categories = await this.getFirstCategories(userId);
        for (const child in categories) {
            let temp: any = {...categories[child]};
            temp.children = [];
            const c = await this.getAllCategoryChildren(categories[child].id, userId);
            console.log(c);
            temp.children = c;
            result.push(temp);
        }
        return result;
    }

    async getParentCategory(categoryId: number, userId: number) {
        const existCategory = await this.categoriesManagerEntity.findOne({
            where: {
                category_id: categoryId,
                user_id: userId

            }
        })
        if(!existCategory){
            throw new BadRequestException('Category with id not found')
        }

        const parent = await this.categoriesRepository.findOne({
            relations: {parent: true},
            where: {
                id: categoryId
            }
        })
        if (!parent.parent) {
            return {parent: -1, name: ''};
        }
        return {parent: parent.parent.id, name: parent.name || 'undefined'};
    }

    async getFullCategoryName(categoryId: number, userId: number) {
        let name = '';
        const category = await this.getCategoryById(categoryId, userId);
        const parent = await this.getParentCategory(categoryId, userId);
        if (parent.parent === -1) {
            return category.name;
        } else {
            name = category.name + name;
            const tempName = await this.getFullCategoryName(parent.parent, userId);
            name = tempName + ' / ' + name;
            return name;
        }

    }


    async deleteCategory(categoryId: number, userId: number) {
        const existCategory = await this.categoriesRepository.findOne({
            where: {
                id: categoryId,
                user: {id: userId}

            }
        })
        if(!existCategory){
            throw new BadRequestException('Category with id not found')
        }

        return await this.categoriesRepository.delete({
            id: existCategory.id
        })
    }

    async createCategory(body: CreateCategoryDto, userId) {
        const ifCategoryExists = await this.getCategoryByName(body.name, userId);
        if (ifCategoryExists) {
            throw new BadRequestException('Category with name already exists')
        }
        const user = await this.usersService.findUserById(userId);

        const ifParentCategoryExists = await this.getCategoryById(body.parentCategoryId, userId);
        if (!ifParentCategoryExists && body.parentCategoryId) {
            throw new BadRequestException('Parent Category with id didnt exists')
        }

        const newCategory = new CategoriesEntity();
        newCategory.name = body.name;
        newCategory.user = user;
        body.parentCategoryId ? newCategory.parent = ifParentCategoryExists : '';
        return await this.categoriesRepository.save(newCategory);
    }

    async updateCategory(categoryId: number, body: UpdateCategoryDto, userId) {
        const existCategory = await this.categoriesManagerEntity.findOne({
            where: {
                category_id: categoryId,
                user_id: userId

            }
        })
        if(!existCategory){
            throw new BadRequestException('Category with id not found')
        }

        if (!body.parentCategoryId && !body.name) {
            throw new BadRequestException('Nothing to update');
        }

        const ifCategoryExists = await this.getCategoryById(categoryId, userId);
        if (!ifCategoryExists) {
            throw new BadRequestException('No category with id');
        }
        if (body.name) {
            const ifCategoryWithName = await this.getCategoryByName(body.name, userId);
            if (ifCategoryWithName && ifCategoryExists.id !== ifCategoryWithName.id) {
                throw new BadRequestException('Category with name already exists');
            }
            ifCategoryExists.name = body.name;
        }

        if (body.parentCategoryId) {
            const ifParentExists = await this.getCategoryById(body.parentCategoryId, userId);
            if (!ifParentExists) {
                throw new BadRequestException('No parent category with id');
            }
            ifCategoryExists.parent = ifParentExists;
        }
        return await this.categoriesRepository.save(ifCategoryExists);
    }

    async getCategoryByName(name: string, userId: number) {
        return await this.categoriesRepository.findOne({
            where: {
                name,
                user: {
                    id: userId
                }
            }
        })
    }

    async getCategoryById(id: number, userId: number) {
        const existCategory = await this.categoriesManagerEntity.findOne({
            where: {
                category_id: id,
                user_id: userId

            }
        })
        if(!existCategory){
            throw new BadRequestException('Category with id not found')
        }

        return await this.categoriesRepository.findOne({
            where: {
                id
            }
        })
    }


}