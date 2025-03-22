import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz, Prisma, QuizSection } from '@prisma/client';
import { PrismaService } from 'src/global/prisma.service';

@Injectable()
export class QuizQuestionService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async createQuizQuestion() {

  }
}