import {Body, Controller, Get, Post, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {InvitesService} from "./invites.service";
import {AccessTokenGuard} from "../auth/guards/accessToken.guard";
import {Request} from "express";
import {CreateCategoryDto} from "../categories/dto/createCategory.dto";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {AddMemberDto} from "./dto/addMember.dto";
import {DeleteMemberDto} from "./dto/deleteMember.dto";


@Controller('invites')
@ApiTags('invites')
@ApiBearerAuth()

export class InvitesController{
    constructor(
        private invitesService: InvitesService
    ) {
    }

    @Post('addMember')
    @UseGuards(AccessTokenGuard)
    async inviteMember(
        @Req() req: Request,
        @Body() body: AddMemberDto,
        @CurrentUser('userId') userId: number,
    ){
        return await this.invitesService.addMember(body.email, userId);
    }

    @Get('getMyMembers')
    @UseGuards(AccessTokenGuard)
    getMyMembers(
        @Req() req: Request,
        @CurrentUser('userId') userId: number,
    ) {
        return;
    }

    @Post('deleteMember')
    @UseGuards(AccessTokenGuard)
    dropMember(
        @Req() req: Request,
        @Body() body: DeleteMemberDto,
        @CurrentUser('userId') userId: number,
    ){
        return;
    }
}