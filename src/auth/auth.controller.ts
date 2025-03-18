import { Body, ConflictException, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOrLogInCompanyDto } from './auth.dto';
import { Public } from 'src/global/services/decorator.service';


@Controller("company")
export class AuthController {
  constructor(
    private readonly CompanyService: AuthService,
  ) { }

  @Get()
  getCompanies() {
    return this.CompanyService.getAllCompanies({})
  }

  @Public()
  @Post()
  async createCompanies(@Body() createUserDto: CreateOrLogInCompanyDto) {

    const existingCompany = await this.CompanyService.findCompany({ email: createUserDto.email })

    if (existingCompany) {
      throw new ConflictException("Email Already Exists")
    }

    return this.CompanyService.createCompany(createUserDto)
  }

  @Public()
  @Post("login")
  loginCompany(@Body() loginUserDto: CreateOrLogInCompanyDto) {
    return this.CompanyService.signIn(loginUserDto.email, loginUserDto.password)
  }
}
