import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from '../auth/dto/registerUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from '../auth/dto/loginUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(registerUserDto: RegisterUserDto) {
    type MongoDuplicateKeyError = {
      code?: number;
      keyValue?: { email?: string };
    };
    try {
      const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
      return await this.userModel.create({
        ...registerUserDto,
        password: hashedPassword,
      });
    } catch (err) {
      const e = err as MongoDuplicateKeyError;
      if (e.code === 11000) {
        throw new ConflictException(
          `User already exists with email: ${e.keyValue?.email}`,
        );
      }
      throw err;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel
      .findOne({ email: loginUserDto.email })
      .select('+password');

    if (user == null) {
      throw new NotFoundException('User Not Found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async getProfile(id: string) {
    return await this.userModel.findById(id);
  }
}
