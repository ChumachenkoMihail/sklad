import {Body, Controller, Get, Param, Post, Req, Res, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {StockService} from "./stock.service";
import {Request} from "express";
import {CreateStockDto} from "./dto/createStock.dto";
import {AccessTokenGuard} from "../auth/guards/accessToken.guard";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {UpdateStockDto} from "./dto/updateStock.dto";


@Controller('stock')
@ApiTags('stock')
@ApiBearerAuth()

export class StockController {

    constructor(private stockService: StockService) {}



    @Get('/createStock')
    @UseGuards(AccessTokenGuard)
    createStockRender(
        @Req() req: Request, @Res() res
    ){
        return res.render('createStock.hbs', {title: 'Новий склад'})
    }

    @Post('/createStock')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    createStock(
        @Req() req: Request,
        @Body() body: CreateStockDto,
        @CurrentUser('userId') userId: number,
    ){
        return this.stockService.createStock(body, userId);
    }

    @Get('/editStock/:stockId')
    @UseGuards(AccessTokenGuard)
    async editStockRender(
        @Req() req: Request,
        @Res() res,
        @Param('stockId') stockId: number,
        @CurrentUser('userId') userId: number,
    ){
        const result = await this.stockService.getStockById(Number(stockId), userId);
        console.log(result);
        return res.render('editStock.hbs', {title: 'Новий склад', result: result})
    }

    @Post('/editStock/:stockId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    changeStockName(
        @Req() req: Request,
        @Body() body: UpdateStockDto,
        @Param('stockId') stockId: number,
        @CurrentUser('userId') userId: number,
    ){
        return this.stockService.updateStock(Number(stockId), body, userId)
    }

    @Post('deleteStock/:stockId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    deleteStock(
        @Req() req: Request,
        @Res() res,
        @Param('stockId') stockId: number,
        @CurrentUser('userId') userId: number,
    ){
        const result = this.stockService.deleteStock(Number(stockId), userId);
        res.redirect('/stock/getStocks')
    }

    @Get('getStocks')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getUserStocks(
        @Req() req: Request,
        @Res() res,
        @CurrentUser('userId') userId: number,
    ){
        const result = await this.stockService.getUserStocks(userId);
        return res.render('stocks.hbs', {result: result, title: 'Склади'})
    }

    @Get('getStockInfo/:stockId')
    @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getUserStockById(
        @Req() req: Request,
        @Res() res,
        @Param('stockId') stockId: number,
        @CurrentUser('userId') userId: number,
    ){
        const result = await this.stockService.getStockWithProducts(Number(stockId), userId);
        console.log(result);
        return res.render('stockById.hbs', {result: result, title: result.stock.name});
    }

    @Post('/changeProductCount/:stockId/:productId/:newCount')
    @UseGuards(AccessTokenGuard)
    async changeProductCount(
        @Req() req: Request,
        @Param('stockId') stockId: number,
        @Param('productId') productId: number,
        @Param('newCount') newCount: number,
        @CurrentUser('userId') userId: number,
    ){
        return await this.stockService.changeProductCount(Number(stockId), Number(productId), Number(newCount));
    }

    @Post('/deleteProductFromStock/:stockId/:productId')
    @UseGuards(AccessTokenGuard)
    async deleteProduct(
        @Req() req: Request,
        @Param('stockId') stockId: number,
        @Param('productId') productId: number,
        @CurrentUser('userId') userId: number,
    ){
        return await this.stockService.deleteProduct(Number(stockId), Number(productId));
    }
}