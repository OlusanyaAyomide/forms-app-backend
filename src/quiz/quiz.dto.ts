import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(7, 20)
  password: string;

}