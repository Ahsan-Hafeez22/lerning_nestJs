import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
