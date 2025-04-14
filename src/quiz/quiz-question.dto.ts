import { IsArray, IsEnum, IsOptional, IsString, ValidateNested, ArrayMinSize, IsNotEmpty, IsUUID, IsInt, IsNumber, min, Length } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionOption {
  @IsNotEmpty()
  @IsString()
  option: string;

  @IsNotEmpty()
  @IsString()
  option_content: string;


  @IsOptional()
  @IsString()
  @IsUUID()
  option_id?: string
}

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsEnum(["Select", "Text"], { message: 'question_type must be either "Select" or "TextArea"' })
  question_type: "Select" | "Text";

  @IsArray()
  // @ArrayMinSize(1, { message: 'correct_answer must have at least one item' })
  @IsString({ each: true })
  correct_answer: string[];

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  explanation_url?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  question_id?: string

  @IsOptional()
  @IsString()
  image_url?: string

  @IsNumber()
  @IsOptional()
  question_order?: number

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

export class CreateUpdateQuizQuestionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizSectionDto)
  sections: QuizSectionDto[]
}

export class QuestionOptionGenerateDto {
  @IsString()
  @Length(7)
  question: string
}