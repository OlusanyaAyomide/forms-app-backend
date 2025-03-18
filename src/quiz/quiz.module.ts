import { Module } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma.service';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.services';


@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService],
  exports: [QuizService]
})
export class QuizModule { }