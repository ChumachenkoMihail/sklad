import {ApiProperty} from "@nestjs/swagger";


export class UpdateProductDto  {
    @ApiProperty({
        example: 'Product 1',
        description: 'Product name'
    })
    name?: string;

    @ApiProperty({
        example: 'Macbook Pro M1',
        description: 'Product description'
    })
    description?: string;

    @ApiProperty({
        example: '{"properties": [{"name": "made", "value": "kipr"}, {"name": "year", "value": 1997}]}',
        description: 'Product properties'
    })
    properties?: string;

    @ApiProperty({
        example: 'FG123-45',
        description: 'Product vendor code'
    })
    vendorCode?: string;

    @ApiProperty({
        example: 123.45,
        description: 'Product price'
    })
    price?: number;

    @ApiProperty({
        example: 1,
        description: 'Product category id'
    })
    categoryId?: number;

    //todo: add image
}