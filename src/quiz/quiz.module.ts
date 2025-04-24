import { Module } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma.service';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.services';
import { GeminiService } from 'src/googleAi/gemini.service';
import { GoogleAIProvider } from 'src/googleAi/google-ai.provider';
import { QuizQuestionService } from './quiz-question.services';
import { ScheduleService } from 'src/global/services/scheduler.service';
import { ResponseService } from 'src/response/response.service';

@Module({
  controllers: [QuizController],
  providers: [
    QuizService,
    PrismaService,
    QuizQuestionService,
    ResponseService,
    GeminiService,
    ScheduleService,
    GoogleAIProvider
  ],
  exports: [QuizService]
})

export class QuizModule { }