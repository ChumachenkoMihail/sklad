import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  Get,
  UseGuards,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { CurrentUser } from './decorators/user.decorator';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { LoginResponseDto } from './dto/login.response.dto';
import { TokensDto } from './dto/tokens.dto';
import { Response } from 'express';


@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/register')
  reg(
      @Res() res,
  ){
    return res.render('register.hbs')
  }
  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Password is too weak',
  })
  @ApiOperation({ summary: 'Registration' })
  register(@Req() req: Request, @Body() body: LoginDto) {
    return this.authService.register(body);
  }

  @Post('/login')
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User does not exist',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password',
  })
  @ApiOperation({ summary: 'Login' })
  async login(@Req() req: Request, @Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  @ApiResponse({
    status: 200,
    description: 'Tokens',
    type: TokensDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Access Denied',
  })
  @ApiOperation({ summary: 'Refresh access token via refresh' })
  refresh(
    @Req() req,
    @CurrentUser('userId') id: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(id, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  @ApiResponse({
    status: 200,
    description: 'Logged out',
    schema: { example: { message: 'Logged out' } },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: 'Log out' })
  async logout(
    @Req() req,
    @Res() res: Response,
    @CurrentUser('userId') id: number,
  ) {
    await this.authService.logout(id);
    res.status(HttpStatus.OK).json({ message: 'Logged out' });
  }
}
