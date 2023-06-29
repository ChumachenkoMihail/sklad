import {BadRequestException, Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {LoginDto} from './dto/login.dto';
import {compare, hashSync} from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {config} from 'dotenv';
import * as process from 'process';
// import { Invites } from '../entities/invites.entity';

config();

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
    }

    async register(user: LoginDto) {
        //check if user exists
        const userExists = await this.usersService.findUserByEmail(user.email);
        if (userExists) {
            throw new BadRequestException('Такий користувач вже існує');
        }
        // check password strong
        if (!user.password.match(/^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,128})/)) {
            throw new BadRequestException('Слабкий пароль');
        }

        //hash password
        const hashedPassword = await hashSync(user.password, 10);
        //create new user
        const newUser = await this.usersService.createUser({
            ...user,
            password: hashedPassword,
        });
        // get access & refresh tokens
        const tokens = await this.getTokens(newUser.id, newUser.email);
        // set users refresh token
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        // return tokens & registration status
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async login(loginDto: LoginDto) {
        //check if user exists
        const user = await this.usersService.findUserByEmail(loginDto.email);
        if (!user) {
            throw new BadRequestException('Такого користувача не існує');
        }
        // check is passwords equal
        const isPasswordEqual = await compare(loginDto.password, user.password);
        if (!isPasswordEqual) {
            throw new BadRequestException('Неправильний пароль');
        }

        // generate new tokens
        const tokens = await this.getTokens(user.id, user.email);
        // update user refresh token
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        // return tokens & registration status
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async logout(userId: number) {
        // delete users refresh token
        await this.usersService.updateRefreshToken(userId, null);
        return {message: 'Logged out'};
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        return await this.usersService.updateRefreshToken(userId, refreshToken);
    }

    async getTokens(userId: number, email: string) {
        // create access token
        const accessToken = await this.jwtService.signAsync(
            {
                userId,
                email,
            },
            {
                secret: process.env.ACCESS_SECRET_KEY,
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
            },
        );

        // create refresh token
        const refreshToken = await this.jwtService.signAsync(
            {
                userId,
                email,
            },
            {
                secret: process.env.REFRESH_SECRET_KEY,
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
            },
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(userId: number, refreshToken: string) {
        // check if user exist & has refresh
        const user = await this.usersService.findUserById(userId);
        if (!user || !user.refreshToken) {
            throw new BadRequestException('Access Denied');
        }
        // get new tokens
        const tokens = await this.getTokens(user.id, user.email);
        // update users refresh token
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

}
