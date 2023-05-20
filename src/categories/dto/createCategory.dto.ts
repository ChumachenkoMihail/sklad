import {ApiProperty} from "@nestjs/swagger";

export class CreateCategoryDto{
    @ApiProperty({
        example: 'Computers',
        description: 'Category name'
    })
    name: string;

    @ApiProperty({
        example: 1,
        description: 'parentCategoryId'
    })
    parentCategoryId?: number;
}