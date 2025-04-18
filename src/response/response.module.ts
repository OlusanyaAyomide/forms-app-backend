import { Module } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma.service';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { QuizService } from 'src/quiz/quiz.services';

@Module({
  controllers: [ResponseController],
  providers: [
    ResponseService,
    PrismaService,
    QuizService,
  ],
  exports: [ResponseService]
})

export class ResponseModule { }