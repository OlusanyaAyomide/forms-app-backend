import { PrismaClient, Quiz, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export type QuizWhereInput = Prisma.QuizWhereInput;
export type QuizOrderByInput = Prisma.QuizOrderByWithRelationInput;
export type QuizIncludeInput = Prisma.QuizInclude;
export type QuizCreateInput = Prisma.QuizCreateInput;
export type QuizUpdateInput = Prisma.QuizUpdateInput;
export type QuizFindFirstArgs = Prisma.QuizFindFirstArgs

export class QuizService {

  async create(data: QuizCreateInput): Promise<Quiz> {
    return prisma.quiz.create({
      data
    });
  }

  async update(id: string, data: QuizUpdateInput): Promise<Quiz> {
    return prisma.quiz.update({
      where: { id },
      data
    });
  }

  async getOne(
    filter: QuizWhereInput,
    options?: QuizFindFirstArgs
  ): Promise<Quiz | null> {
    return prisma.quiz.findFirst({
      where: filter,
      ...options
    });
  }

  async getMany(
    where?: QuizWhereInput,
    take?: number,
    skip?: number,
    orderBy?: QuizOrderByInput | QuizOrderByInput[],
    include?: QuizIncludeInput
  ): Promise<{ quizzes: Quiz[]; total: number }> {
    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        take,
        skip,
        orderBy,
        include
      }),
      prisma.quiz.count({ where })
    ]);

    return {
      quizzes,
      total
    };
  }

  async delete(id: string): Promise<Quiz> {
    return prisma.quiz.delete({
      where: { id }
    });
  }
}

export default new QuizService();