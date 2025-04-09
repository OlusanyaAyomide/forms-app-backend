import { IsArray, IsEnum, IsOptional, IsString, ValidateNested, ArrayMinSize, IsNotEmpty, IsUUID, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionOption {
  @IsNotEmpty()
  @IsString()
  option: string;

  @IsNotEmpty()
  @IsString()
  option_content: string;
}

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsEnum(["Select", "TextArea"], { message: 'question_type must be either "Select" or "TextArea"' })
  question_type: "Select" | "TextArea";

  @IsArray()
  // @ArrayMinSize(1, { message: 'correct_answer must have at least one item' })
  @IsString({ each: true })
  correct_answer: string[];

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  image_url?: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionOption)
  options?: QuestionOption[];
}


export class QuizSectionDto {

  @IsString()
  @IsUUID()
  section_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @IsOptional()
  @IsInt()
  section_scores?: number;

  @IsOptional()
  @IsInt()
  section_assigned_total_score?: number;
}

export class CreateQuizQuestionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizSectionDto)
  sections: QuizSectionDto[]
}