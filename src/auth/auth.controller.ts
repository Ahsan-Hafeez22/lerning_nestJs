import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.logout(dto.refreshToken);
  }
}
