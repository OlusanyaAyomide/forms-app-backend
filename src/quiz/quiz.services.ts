import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz, Prisma, QuizSection } from '@prisma/client';
import { PrismaService } from 'src/global/prisma.service';
import { handlePrismaError } from 'src/global/services/prisma.error.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.QuizCreateInput): Promise<Quiz> {
    return this.prisma.quiz.create({
      data,
    });
  }

  async update(id: string, data: Prisma.QuizUpdateInput): Promise<Quiz> {
    try {
      return await this.prisma.quiz.update({
        where: { id },
        data,
      });
    } catch (err) {
      handlePrismaError(err);
      throw err;
    }
  }

  async getOne(
    filter: Prisma.QuizWhereInput,
    options?: Prisma.QuizFindFirstArgs,
  ): Promise<Quiz> {
    const quiz = await this.prisma.quiz.findFirst({
      where: filter,
      ...options,
    });
    if (!quiz) {
      throw new NotFoundException('Quiz has been closed or deleted by owner');
    }
    return quiz;
  }

  async getQuizFromAttempt(
    filter: Prisma.QuizAttemptsWhereInput,
    options?: Prisma.QuizFindFirstArgs,
  ): Promise<Quiz> {
    const attempt = await this.prisma.quizAttempts.findFirst({
      where: filter,
      include: {
        Quiz: {
          select: { id: true },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt ID is invalid');
    }

    return this.getOne({ id: attempt.Quiz.id }, options);
  }

  async getMany(
    where?: Prisma.QuizWhereInput,
    take?: number,
    skip?: number,
    orderBy?:
      | Prisma.QuizOrderByWithRelationInput
      | Prisma.QuizOrderByWithRelationInput[],
    include?: Prisma.QuizInclude,
  ): Promise<{ quizzes: Quiz[]; total: number }> {
    const [quizzes, total] = await Promise.all([
      this.prisma.quiz.findMany({
        where,
        take,
        skip,
        orderBy,
        include,
      }),
      this.prisma.quiz.count({ where }),
    ]);

    return {
      quizzes,
      total,
    };
  }

  async delete(id: string): Promise<Quiz> {
    return this.prisma.quiz.delete({
      where: { id },
    });
  }

  async createQuizSection(
    data: Prisma.QuizSectionCreateInput,
  ): Promise<QuizSection> {
    const quizId = data.Quiz.connect?.id;

    await this.prisma.utils.ensureQuizExists(quizId);

    const quizExists = await this.prisma.quiz.findFirst({
      where: { id: quizId },
      select: { id: true },
    });

    if (!quizExists) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }
    return this.prisma.quizSection.create({
      data,
    });
  }

  async updateQuizSection(
    id: string,
    data: Prisma.QuizSectionUpdateInput,
  ): Promise<QuizSection> {
    try {
      return this.prisma.quizSection.update({
        where: { id },
        data,
      });
    } catch (err) {
      handlePrismaError(err);
      throw err;
    }
  }

  //will add more to this in the future
  async attemptOverView({ quizId }: { quizId: string }) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { id: quizId },
      include: {
        attempts: {
          where: {
            status: 'Submitted',
          },
        },
      },
    });

    return quiz;
  }
}
