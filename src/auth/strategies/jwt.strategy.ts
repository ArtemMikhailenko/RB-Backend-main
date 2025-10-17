// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity'; // adjust path

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!, // ensure env is set
    });
  }

  async validate(payload: any) {
    // IMPORTANT: your tokens use `sub` for the id
    console.log('JWT payload in strategy:', payload);
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      select: [
      'id',
      'firstName',
      'lastName',
      'email',
      'profilePic',
      'googleId',
      'provider',
      'country',
    ],
    });
    console.log('DB user found by sub:', user);

    if (!user) throw new UnauthorizedException('User not found');

    // returning the entity means `req.user` IS this object
    return user;
  }
}
