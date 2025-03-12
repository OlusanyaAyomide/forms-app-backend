import { Body, Controller, Get, Post } from "@nestjs/common"

@Controller("quiz")
export class CompanyController {
  constructor(
    // private readonly CompanyService: CompanyService,
  ) { }

  @Get()
  getCompanies() {
    // return this.CompanyService.getAllCompanies({})
  }


}
