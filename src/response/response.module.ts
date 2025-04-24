import { Module } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma.service';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { QuizService } from 'src/quiz/quiz.services';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ResponseController],
  providers: [
    ResponseService,
    QuizService,
    PrismaService,
    AuthService,
    JwtService,
    QuizService,
  ],
  exports: [ResponseService],
})
export class ResponseModule {}
