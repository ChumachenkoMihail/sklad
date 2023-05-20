import {ApiProperty} from "@nestjs/swagger";


export class CreateStockDto  {
    @ApiProperty({
        example: 'Stock 1',
        description: 'Stock name'
    })
    name: string;

    @ApiProperty({
        example: 'PC stock',
        description: 'Stock description'
    })
    description?: string;

    @ApiProperty({
        example: 'Odessa, Zabolotnogo 1',
        description: 'Stock address'
    })
    address: string;
}