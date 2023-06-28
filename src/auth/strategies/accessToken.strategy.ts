import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'dotenv';
import { Request } from "express";

config();

type JwtPayload = {
  sub: string;
  email: string;
};
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        let data = request?.cookies["jwt"];
        if(!data){
          return null;
        }
        return data;


      }]),
      secretOrKey: process.env.ACCESS_SECRET_KEY,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
