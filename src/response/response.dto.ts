import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ResponseDto {
  @IsUUID()
  question_id: string;

  @IsUUID()
  @IsOptional()
  option_id?: string;

  @IsString()
  answer: string;
}