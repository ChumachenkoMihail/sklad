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
        @Param('stockId') stockId: number,
        @CurrentUser('userId') userId: number,
    ){
        return this.stockService.deleteStock(Number(stockId), userId);
    }

    @Get('getStocks')
    // @UseGuards(AccessTokenGuard)
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getUserStocks(
        @Req() req: Request,
        @Res() res,
        // @CurrentUser('userId') userId: number,
    ){
        const result = await this.stockService.getUserStocks(1);
        console.log(result);
        return res.render('stocks.hbs', {result: result})
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
        const result = await this.stockService.getStockById(Number(stockId), userId);
        return res.render('stockById.hbs', {result: result});
    }
}