import { Module } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma.service';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.services';
import { GeminiService } from 'src/googleAi/gemini.service';
import { GoogleAIProvider } from 'src/googleAi/google-ai.provider';

@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService, GeminiService, GoogleAIProvider],
  exports: [QuizService]
})
export class QuizModule { }