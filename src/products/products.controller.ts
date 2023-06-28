import {Body, Controller, Get, Param, Post, Req, Res, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Request} from "express";
import {AccessTokenGuard} from "../auth/guards/accessToken.guard";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {ProductsService} from "./products.service";
import {CreateProductDto} from "./dto/createProduct.dto";
import {UpdateProductDto} from "./dto/updateProduct.dto";


@Controller('products')
@ApiTags('products')
@ApiBearerAuth()

export class ProductsController {

    constructor(private productsService: ProductsService) {}


    @Get('/createProduct')
    // @UseGuards(AccessTokenGuard)
    getCreateProduct(
        @Res() res
    ){
        return res.render('AddProduct.hbs')
    }

    @Post('/createProduct')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    createProduct(
        @Req() req: Request,
        @Body() body: CreateProductDto,
        @CurrentUser('userId') userId: number,
    ){
        return this.productsService.createProduct(body, userId);
    }

    @Post('/editProduct/:productId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    updateProduct(
        @Req() req: Request,
        @Body() body: UpdateProductDto,
        @Param('productId') productId: number,
        @CurrentUser('userId') userId: number,
    ){
        return this.productsService.updateProduct(Number(productId), body, userId)
    }

    @Post('deleteProduct/:productId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    deleteProduct(
        @Req() req: Request,
        @Param('productId') productId: number,
        @CurrentUser('userId') userId: number,
    ){
       return this.productsService.deleteProduct(Number(productId), userId);
    }

    @Get('getProducts')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
   async getUserProducts(
        @Req() req: Request,
        @Res()res,
        @CurrentUser('userId') userId: number,
    ){
        const result = await this.productsService.getUserProducts(userId);
    return res.render('GetProducts.hbs',{result: result});
    }

    @Get('getProductInfo/:productId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
   async getUserProductById(
        @Req() req: Request,
        @Res() res,
        @Param('productId') productId: number,
        @CurrentUser('userId') userId: number,
    ){
      const result = await this.productsService.getProductById(Number(productId), userId);
    return res.render('InformOfProduct.hbs', {result: result});
        }
}