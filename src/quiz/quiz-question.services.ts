import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz, Prisma, QuizSection, QuizQuestion } from '@prisma/client';
import { PrismaService } from 'src/global/prisma.service';
import { CreateUpdateQuizQuestionDto } from './quiz-question.dto';
import { handlePrismaError } from 'src/global/services/prisma.error.service';


@Injectable()
export class QuizQuestionService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async createUpdateQuizQuestion(
    quizQuestions: CreateUpdateQuizQuestionDto,
    quizId: string
  ) {
    try {
      const generatedQuiz = await this.prisma.quiz.update({
        where: {
          id: quizId,
        },
        data: {
          sections: {
            update: quizQuestions.sections.map((section) => ({
              where: {
                id: section.section_id,
                quiz_id: quizId,
              },
              data: {
                section_scores: section.section_scores,
                section_assigned_total_score: section.section_assigned_total_score,
                questions: {
                  // For each question, decide whether to update or create
                  ...(section.questions.some(q => q.question_id) ? {
                    upsert: section.questions
                      .filter(question => question.question_id) // Only include questions with IDs for upsert
                      .map((question, index) => ({
                        where: {
                          id: question.question_id,
                        },
                        update: {
                          question: question.question,
                          type: question.question_type,
                          correct_answer: question.correct_answer,
                          image_url: question.image_url,
                          explanation_url: question.explanation_url,
                          explanation: question.explanation,
                          question_order: question.question_order,
                          options: {
                            // Only include options upsert if there are options with IDs
                            ...(question.options?.some(o => o.option_id) ? {
                              upsert: question.options
                                .filter(option => option.option_id)
                                .map((option) => ({
                                  where: {
                                    id: option.option_id,
                                  },
                                  update: {
                                    option: option.option,
                                    option_content: option.option_content,
                                  },
                                  create: {
                                    option: option.option,
                                    option_content: option.option_content,
                                  },
                                }))
                            } : {}),
                            // Create new options if they don't have IDs
                            ...(question.options?.some(o => !o.option_id) ? {
                              create: question.options
                                .filter(option => !option.option_id)
                                .map((option) => ({
                                  option: option.option,
                                  option_content: option.option_content,
                                }))
                            } : {})
                          },
                        },
                        create: {
                          question: question.question,
                          type: question.question_type,
                          correct_answer: question.correct_answer,
                          image_url: question.image_url,
                          explanation_url: question.explanation_url,
                          explanation: question.explanation,
                          question_order: index,
                          options: {
                            create: question.options?.map((option) => ({
                              option: option.option,
                              option_content: option.option_content,
                            })),
                          },
                        },
                      }))
                  } : {}),
                  // Create new questions if they don't have IDs
                  ...(section.questions.some(q => !q.question_id) ? {
                    create: section.questions
                      .filter(question => !question.question_id)
                      .map((question, index) => ({
                        question: question.question,
                        type: question.question_type,
                        correct_answer: question.correct_answer,
                        explanation: question.explanation,
                        image_url: question.image_url,
                        explanation_url: question.explanation_url,
                        question_order: question.question_order || index,
                        options: {
                          create: question.options?.map((option) => ({
                            option: option.option,
                            option_content: option.option_content,
                          })),
                        },
                      }))
                  } : {})
                },
              },
            })),
          },
        },
        include: {
          sections: {
            include: {
              questions: {
                include: {
                  options: true
                }
              }
            }
          },
          attempts: true,
        }
      });
      return generatedQuiz;
    } catch (err) {
      console.log(err)
      handlePrismaError(err);
    }
  }

  async getOneQuestion(
    filter: Prisma.QuizQuestionWhereInput,
    options?: Prisma.QuizQuestionFindFirstArgs
  ): Promise<QuizQuestion | null> {
    return this.prisma.quizQuestion.findFirst({
      where: filter,
      ...options
    });
  }
}