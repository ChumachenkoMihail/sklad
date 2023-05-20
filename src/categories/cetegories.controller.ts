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
    getFirstCategories(
        @Req() req: Request,
        @CurrentUser('userId') userId: number,
    ){
        return this.categoriesService.getFirstCategories(userId);
    }

    @Get('getCategoryChildren/:categoryId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    getCategoriesChildren(
        @Req() req: Request,
        @Param('categoryId') categoryId: number,
        @CurrentUser('userId') userId: number,
    ){
        return this.categoriesService.getCategoryChildren(Number(categoryId),userId);
    }

    @Get('getFullCategories')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    getFullCategories(
        @Req() req: Request,
        @CurrentUser('userId') userId: number,
    ){
        return this.categoriesService.getFullCategories(userId);
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