import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { PrismaService } from './global/prisma.service';
import { CompanyModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { QuizModule } from './quiz/quiz.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration]
  }),
    CompanyModule, QuizModule, ResponseModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule { }
