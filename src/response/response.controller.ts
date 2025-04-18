import { Controller, Get, Ip, Param, Req } from "@nestjs/common"
import { Request } from "express";
import { Public } from "src/global/services/decorator.service";
import { generateDeviceId } from "src/global/services/hash.service";
import { QuizService } from "src/quiz/quiz.services";
import { ResponseService } from "./response.service";


@Public()
@Controller("response")
export class ResponseController {
  constructor(
    private quizService: QuizService,
    private responseService: ResponseService
  ) { }

  @Get("quiz/:quiz_id/basic-info")
  async getQuizDetail(
    @Param('quiz_id') quizId: string,
    @Req() req: Request,
    @Ip() userIp: string
  ) {

    const fingerPrint = await generateDeviceId(req)

    const quizInfo = await this.quizService.getOne({ id: quizId }, {
      select: {
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

    const canTakeQuiz = allow_multiple_attempts ? true : await this.responseService.isEligibleToTakeQuiz(
      { ipAddress: userIp, fingerPrint, quizId: quizId })

    return {
      ...quizData, canTakeQuiz
    }
  }


}
