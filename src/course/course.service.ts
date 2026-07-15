import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './schemas/course.schema';
import { isMongoDuplicateKeyError } from '../common/utils/mongo-error.util';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto) {
    const existing = await this.courseModel.findOne({
      courseName: createCourseDto.courseName,
    });

    if (existing) {
      throw new ConflictException(
        `Course with name "${createCourseDto.courseName}" already exists`,
      );
    }

    try {
      return await this.courseModel.create(createCourseDto);
    } catch (err: unknown) {
      if (isMongoDuplicateKeyError(err)) {
        throw new ConflictException(
          `Course with name "${createCourseDto.courseName}" already exists`,
        );
      }
      throw err;
    }
  }

  async findAll() {
    // Empty result is a valid state, not an error — return [] as-is.
    return this.courseModel.find();
  }

  async findOne(id: string) {
    this.validateId(id);

    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    this.validateId(id);

    const course = await this.courseModel.findByIdAndUpdate(
      id,
      updateCourseDto,
      { returnDocument: 'after', runValidators: true },
    );
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  async remove(id: string) {
    this.validateId(id);

    const course = await this.courseModel.findByIdAndDelete(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return { message: 'Course deleted successfully' };
  }

  private validateId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid course id: ${id}`);
    }
  }
}
