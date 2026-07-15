import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token/refresh.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  private async generateAccessToken(userId: string) {
    return this.jwtService.signAsync(
      { sub: userId },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
    );
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.userService.register(registerUserDto);
    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.refreshTokenService.createToken(user._id);
    return { user: user, accessToken, refreshToken };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.login(loginUserDto);
    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.refreshTokenService.createToken(user._id);
    return { user: user, accessToken, refreshToken };
  }

  async getProfile(id: string) {
    const user = await this.userService.getProfile(id);
    return user;
  }

  async refresh(oldRefreshToken: string) {
    const userId =
      await this.refreshTokenService.validateAndRotate(oldRefreshToken);
    const accessToken = await this.generateAccessToken(userId.toString());
    const refreshToken = await this.refreshTokenService.createToken(userId);
    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenService.revokeToken(refreshToken);
    return { message: 'Logged out successfully' };
  }
}
