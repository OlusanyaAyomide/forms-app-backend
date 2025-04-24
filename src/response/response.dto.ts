import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ResponseDto {
  @IsUUID()
  question_id: string;

  @IsUUID()
  @IsOptional()
  option_id?: string;

  @IsString()
  answer: string;
}

export class QuestionAttemptDto {
  @IsUUID()
  @IsString()
  question_id: string;

  @IsString()
  answer: string;
}

export class createUpdateQuestionAttemptDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAttemptDto)
  attempts: QuestionAttemptDto[];
}

export class ResponseAttemptDto {
  @IsString()
  @IsEmail()
  email: string;
}


export class FlagQuestionDto {

  @IsUUID()
  questionId: string

  @IsOptional()
  @IsString()
  description: string

}