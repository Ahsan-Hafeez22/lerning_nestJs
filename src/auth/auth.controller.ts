import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }
  /*
  1. Check if email exsists?
  2. Hash password
  3. Create user
  4. Generate JWT Token
  5. Send JWT Token in Response
  */

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const createdUser = await this.authService.register(registerUserDto);
    return createdUser;
  }
}
