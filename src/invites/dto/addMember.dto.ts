import {ApiProperty} from "@nestjs/swagger";

export class AddMemberDto{
    @ApiProperty({
        example: 'test@gmail.com',
        description: 'Member email'
    })
    email: string;
}