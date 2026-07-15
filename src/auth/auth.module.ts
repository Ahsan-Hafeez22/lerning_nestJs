import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './refresh-token/schemas/refreshToken.schema';
import { RefreshTokenService } from './refresh-token/refresh.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService],
})
export class AuthModule {}
