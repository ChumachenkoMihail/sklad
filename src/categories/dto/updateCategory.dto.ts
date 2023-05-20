import {ApiProperty} from "@nestjs/swagger";

export class UpdateCategoryDto{
    @ApiProperty({
        example: 'Computers',
        description: 'Category name'
    })
    name?: string;

    @ApiProperty({
        example: 1,
        description: 'parentCategoryId'
    })
    parentCategoryId?: number;
}