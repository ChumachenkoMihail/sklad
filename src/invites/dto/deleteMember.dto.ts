import {ApiProperty} from "@nestjs/swagger";

export class DeleteMemberDto{
    @ApiProperty({
        example: 1,
        description: 'Member id'
    })
    member_id: number;
}