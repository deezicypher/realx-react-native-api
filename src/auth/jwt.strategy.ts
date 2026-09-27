
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
        private userService:UsersService,
        configService:ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt_secret')!,
    });
  }

  async validate(payload: any) {
    const user = this.userService.findOne(payload.sub)
    if(!user){
      throw new UnauthorizedException("User no longer exists")
    }
    return user
  }
}
