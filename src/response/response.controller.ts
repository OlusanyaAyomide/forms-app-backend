import { Body, Controller, Get, Ip, NotFoundException, Param, Post, Req, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common"
import { Request } from "express";
import { Company, Public, Role, RoleOnly } from "src/global/services/decorator.service";
import { generateDeviceId } from "src/global/services/hash.service";
import { QuizService } from "src/quiz/quiz.services";
import { ResponseService } from "./response.service";
import { createUpdateQuestionAttemptDto, ResponseAttemptDto } from "./response.dto";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/global/prisma.service";
import { PayloadMetaData } from "src/auth/auth.types";

@Controller("response")
export class ResponseController {
  constructor(
    private quizService: QuizService,
    private responseService: ResponseService,
    private authService: AuthService,
    private prismaService: PrismaService
  ) { }

  @Public()
  @Get("quiz/:quiz_id/basic-info")
  async getQuizDetail(
    @Param('quiz_id') quizId: string,
    @Req() req: Request,
    @Ip() userIp: string
  ) {

    const fingerPrint = await generateDeviceId(req)

    const quizInfo = await this.quizService.getOne({ id: quizId }, {
      select: {
        id: true,
        quiz_theme: true,
        title: true,
        description: true,
        duration: true,
        opened_at: true,
        closed_at: true,
        status: true,
        allow_multiple_attempts: true,
      }
    })

    const { allow_multiple_attempts, ...quizData } = quizInfo

    const canTakeQuiz = await this.responseService.isEligibleToTakeQuiz(
      { ipAddress: userIp, fingerPrint, quizId: quizId })

    return {
      ...quizData, canTakeQuiz
    }
  }

  @Post("quiz/:quiz_id/attempt/create")
  async createQuizAttempt(
    @Param('quiz_id') quizId: string,
    @Req() req: Request,
    @Body() createAttemptDto: ResponseAttemptDto,
    @Ip() userIp: string
  ) {

    const fingerPrint = await generateDeviceId(req)

    const quizInfo = await this.quizService.getOne({ id: quizId, status: "Opened" }, {
      select: {
        id: true,
        company_id: true,
      },
      include: { attempts: true }
    })

    const isEligible = await this.responseService.isEligibleToTakeQuiz({
      ipAddress: userIp, fingerPrint, quizId
    })

    if (!isEligible) {
      throw new UnauthorizedException("Quiz can not be taken again")
    }

    const member = await this.responseService.findMemberByEmailOrCreate({
      email: createAttemptDto.email,
      companyID: quizInfo.company_id
    })

    const quizAttempt = await this.responseService.createQuizAttempt({
      email: member.email,
      companyID: quizInfo.company_id,
      ipAddress: userIp,
      quizId,
      fingerPrint
    })

    const memberAuthData = await this.authService.memberPasswordLessSignIn({
      email: member.email, memberId: member.id
    })

    return {
      data: {
        member,
        auth: memberAuthData,
        attempt: {
          id: quizAttempt.id,
          quizId: quizAttempt.quiz_id
        }
      }
    }
  }

  @RoleOnly(Role.Member)
  @Post("quiz/:quiz_id/attempt/update")
  async updateQuizAttempt(
    @Param('attempt_id') attemptId: string,
    @Body() createUpdateAttemptDto: createUpdateQuestionAttemptDto,
    @Company() member: PayloadMetaData

  ) {

    const quizAttempt = await this.prismaService.quizAttempts.findFirst({
      where: {
        id: attemptId, member_id: member.id,
      }, include: {
        Quiz: true
      }
    })

    if (!quizAttempt) {
      throw new NotFoundException("Attempt does not exist")
    }

    if (quizAttempt?.Quiz.status !== "Opened") {
      return new UnprocessableEntityException("Quiz no longer accepting response")
    }

    const updatedAttempt = this.responseService.updateQuizAttempt(
      { attemptId: quizAttempt.id, attempts: createUpdateAttemptDto }
    )

    return updatedAttempt
  }

}
