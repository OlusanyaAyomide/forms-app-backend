import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { quiz_access_type, quiz_status } from '@prisma/client';
import { IsFutureDate } from 'src/global/services/decorator.service';

enum QuizType {
  Quiz = 'Quiz',
  Form = 'Form',
}

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  special_instruction?: string;

  @IsOptional()
  @IsString()
  quiz_theme?: string;

  @IsOptional()
  @IsString()
  quiz_logo?: string;

  @IsOptional()
  @IsEnum(quiz_access_type)
  access_type?: quiz_access_type;

  @IsOptional()
  @IsEnum(quiz_status)
  status?: quiz_status;

  @IsOptional()
  @IsBoolean()
  allow_multiple_attempts?: boolean;

  @IsOptional()
  @IsBoolean()
  auto_submit_on_time_out?: boolean;

  @IsOptional()
  @IsEnum(QuizType)
  quiz_type?: QuizType;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsBoolean()
  show_question_number?: boolean;

  @IsOptional()
  @IsBoolean()
  show_total_question?: boolean;

  @IsOptional()
  @IsString()
  form_password?: string;

  @IsOptional()
  @IsString()
  start_button_text?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  opened_at?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  closed_at?: Date;
}

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 500)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  special_instruction?: string;

  @IsOptional()
  @IsString()
  quiz_theme?: string;

  @IsOptional()
  @IsString()
  quiz_logo?: string;

  @IsOptional()
  @IsEnum(quiz_access_type)
  access_type?: quiz_access_type;

  @IsOptional()
  @IsEnum(quiz_status)
  status?: quiz_status;

  @IsOptional()
  @IsBoolean()
  allow_multiple_attempts?: boolean;

  @IsOptional()
  @IsBoolean()
  auto_submit_on_time_out?: boolean;

  @IsOptional()
  @IsEnum(QuizType)
  quiz_type?: QuizType;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsBoolean()
  show_question_number?: boolean;

  @IsOptional()
  @IsBoolean()
  show_total_question?: boolean;

  @IsOptional()
  @IsString()
  form_password?: string;

  @IsOptional()
  @IsString()
  start_button_text?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  opened_at?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  closed_at?: Date;
}

export class CreateQuizSectionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  section_scores?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  section_assigned_total_score?: number;
}

export class QuizGeneratorDto {
  @IsNotEmpty()
  @IsString()
  @Length(50, 100000)
  text: string;
}

export class QuizStatusPayloadDto {
  @IsEnum(quiz_status)
  status: quiz_status;

  @IsString()
  quiz_id: string;

  @Type(() => Date)
  @IsDate()
  scheduled_at: Date;
}

export class QuizStatusSchedulerDto {
  @IsEnum(quiz_status)
  @IsString()
  status: quiz_status;

  @Type(() => Date)
  @IsDate()
  @IsFutureDate({ message: 'Scheduled At must be in the future' })
  scheduled_at: Date;
}


export class ResolveFlagDto {

  @IsUUID()
  questionId: string
}