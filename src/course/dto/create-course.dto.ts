import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CourseLevel } from '../couse.types';

function trimIfString({ value }: TransformFnParams): unknown {
  const v: unknown = value;
  return typeof v === 'string' ? v.trim() : v;
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Transform(trimIfString)
  courseName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  @Transform(trimIfString)
  description: string;

  @IsEnum(CourseLevel, {
    message: `level must be one of: ${Object.values(CourseLevel).join(', ')}`,
  })
  level: CourseLevel;

  @IsNumber()
  @Min(0)
  @Max(100000)
  price: number;
}
