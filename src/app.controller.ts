import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from 'src/config/EnvVariables';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService<EnvVariable>
  ) { }

  @Get()
  getHello(): string {
    // console.log(process.env.DATABASE_URL)
    console.log(this.configService.get("database.url", { infer: true }))
    return this.appService.getHello();
  }
}
