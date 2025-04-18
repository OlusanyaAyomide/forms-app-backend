import { Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { PrismaService } from 'src/global/prisma.service';




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
      const newMember = await this.prisma.member.create({
        data: {
          email,
          companies: {
            create: {
              company_id: companyID
            }
          }
        }
      })
      return newMember
    }
  }

  async isEligibleToTakeQuiz(
    { ipAddress, fingerPrint, quizId }:
      { ipAddress: string, fingerPrint: string, quizId: string }
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

    return quiz?.attempts.length === 0

  }

}
