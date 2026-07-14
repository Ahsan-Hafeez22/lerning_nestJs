import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/registerUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(registerUserDto: RegisterUserDto) {
    type MongoDuplicateKeyError = {
      code?: number;
      keyValue?: {
        email?: string;
      };
    };
    try {
      return await this.userModel.create(registerUserDto);
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
}
