import {Body, Controller, Get, Param, Post, Req, Res, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Request} from "express";
import {CategoriesService} from "./cetegories.service";
import {AccessTokenGuard} from "../auth/guards/accessToken.guard";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {CreateCategoryDto} from "./dto/createCategory.dto";
import {UpdateCategoryDto} from "./dto/updateCategory.dto";


@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth()

export class CategoriesController {

    constructor(private categoriesService: CategoriesService) {}

    @Post('/createCategory')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    createCategory(
        @Req() req: Request,
        @Body() body: CreateCategoryDto,
        @CurrentUser('userId') userId: number,
    ){
        return this.categoriesService.createCategory(body, userId);
    }

    @Get('getFirstCategories')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
   async getFirstCategories(
        @Req() req: Request,
        @Res()res,
        @CurrentUser('userId') userId: number,
    ){
        const result = await this.categoriesService.getFirstCategories(userId);
        return res.render('FirstCategories.hbs',{result: result});
    }

    @Get('getCategoryChildren/:categoryId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getCategoriesChildren(
        @Req() req: Request,
        @Res()res,
        @Param('categoryId') categoryId: number,
        @CurrentUser('userId') userId: number,
    ){
        const result = await this.categoriesService.getCategoryChildren(Number(categoryId),userId);
        return res.render('GetChildrenCategory.hbs',{result: result});
    }

    @Get('getFullCategories')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getFullCategories(
        @Req() req: Request,
        @Res()res,
        @CurrentUser('userId') userId: number,
    ){
        const result = await this.categoriesService.getFullCategories(userId);
        return res.render('FullCategories.hbs',{result: result});
    }

    @Post('/editCategory/:categoryId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    updateCategory(
        @Req() req: Request,
        @Body() body: UpdateCategoryDto,
        @Param('categoryId') categoryId: number,
        @CurrentUser('userId') userId: number,
    ){
        return this.categoriesService.updateCategory(Number(categoryId), body, userId)
    }

    @Post('deleteCategory/:categoryId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    deleteCategory(
        @Req() req: Request,
        @Param('categoryId') categoryId: number,
        @CurrentUser('userId') userId: number,
    ){
        return this.categoriesService.deleteCategory(Number(categoryId), userId);
    }
}