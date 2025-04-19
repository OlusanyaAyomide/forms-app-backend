import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Member } from '@prisma/client';
import { PrismaService } from 'src/global/prisma.service';
import { CheckEligibilityArgs } from 'src/quiz/quiz.types';


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

  async updateQuizAttempt() {

  }
}
