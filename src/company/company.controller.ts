import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './company.dto';


@Controller("company")
export class CompanyController {
  constructor(
    private readonly CompanyService: CompanyService,
  ) { }

  @Get()
  getCompanies() {
    return this.CompanyService.getAllCompanies({})
  }

  @Post()
  createCompanies(@Body() createUserDto: CreateCompanyDto) {
    return this.CompanyService.createCompany(createUserDto)
  }
}
