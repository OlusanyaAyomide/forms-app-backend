import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Member } from '@prisma/client';
import { PrismaService } from 'src/global/prisma.service';
import { CheckEligibilityArgs } from 'src/quiz/quiz.types';
import { createUpdateQuestionAttemptDto } from './response.dto';
import { QuizService } from 'src/quiz/quiz.services';


@Injectable()
export class ResponseService {
  constructor(
    private prisma: PrismaService,
  ) { }
  async findMemberByEmailOrCreate(
    { email, companyID }: { email: string, companyID: string }
  ): Promise<Member> {
    const memberData = await this.prisma.member.findFirst({
      where: {
        email
      }
    })

    if (memberData) {
      return memberData
    } else {
      return await this.prisma.member.create({
        data: {
          email,
          companies: {
            create: {
              company_id: companyID
            }
          }
        }
      })
    }
  }

  async isEligibleToTakeQuiz(
    { ipAddress, fingerPrint, quizId }:
      CheckEligibilityArgs
  ): Promise<boolean> {
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id: quizId
      },
      include: {
        attempts: {
          where: {
            OR: [
              { ip_address: ipAddress },
              { finger_print: fingerPrint }
            ]
          }
        }
      }
    })

    return (quiz?.attempts.length === 0) || (!!quiz?.allow_multiple_attempts)

  }

  async createQuizAttempt(
    { email, ipAddress, quizId, fingerPrint, companyID }:
      CheckEligibilityArgs & { email: string, companyID: string }
  ) {
    const isEligible = await this.isEligibleToTakeQuiz({ ipAddress, fingerPrint, quizId })

    if (!isEligible) {
      throw new UnauthorizedException("Quiz Already Attempted")
    }

    const member = await this.findMemberByEmailOrCreate({ email, companyID })

    return await this.prisma.quizAttempts.create({
      data: {
        member_id: member.id,
        ip_address: ipAddress,
        finger_print: fingerPrint,
        quiz_id: quizId,
      }
    })
  }

  async updateQuizAttempt(
    { attemptId, attempts }:
      { attemptId: string, attempts: createUpdateQuestionAttemptDto }) {

    const memberQuizAttempts = await this.prisma.quizAttempts.update({
      where: {
        id: attemptId
      },
      data: {
        attempt_answers: {
          upsert: attempts.attempts.map(attempt => ({
            where: {
              // This requires a compound unique constraint on QuizQuestionAttempts in your Prisma schema:
              // @@unique([quizAttemptsId, quizQuestionId])
              quizAttemptsId_quizQuestionId: {
                quizAttemptsId: attemptId,
                quizQuestionId: attempt.question_id,
              },
            },
            update: {
              answer: attempt.answer,
            },
            create: {
              answer: attempt.answer,
              quizQuestionId: attempt.question_id,
              // quizAttemptsId is implicitly linked by the nested write when using upsert on a related list
            },
          }))
        }
      },
      include: {
        attempt_answers: true
      }
    })

    return memberQuizAttempts
  }

}
