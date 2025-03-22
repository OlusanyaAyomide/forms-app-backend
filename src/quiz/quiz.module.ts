import { Module } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma.service';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.services';
import { GeminiService } from 'src/googleAi/gemini.service';
import { GoogleAIProvider } from 'src/googleAi/google-ai.provider';
import { QuizQuestionService } from './quiz-question.services';

@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService, QuizQuestionService, GeminiService, GoogleAIProvider],
  exports: [QuizService]
})

export class QuizModule { }