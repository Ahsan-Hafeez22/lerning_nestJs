import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CourseLevel } from '../couse.types';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ required: true, unique: true, trim: true })
  courseName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, select: false })
  price: number;

  @Prop({ default: CourseLevel.BEGINNER })
  level: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
