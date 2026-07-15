import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.userService = userService;
  }

  async register(registerUserDto: RegisterUserDto) {
    const saltRound = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRound);
    registerUserDto.password = hash;

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });
    const payload = { sub: user.id };
    // console.log(process.env.JWT_ACCESS_SECRET);
    const token = await this.jwtService.signAsync(payload);
    console.log('Token: ', token);
    return user;
  }
}
