import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common"
import { CreateQuizDto } from "./quiz.dto";
import { CompanyMetaData, CustomRequest } from "src/auth/auth.types";
import { QuizService } from "./quiz.services";
import { Company } from "src/global/services/decorator.service";


@Controller("quiz")
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
  ) { }

  @Post()
  async CreateQuizDto(
    @Body() createQuizDto: CreateQuizDto,
    @Company() company: CompanyMetaData
  ) {
    const defaultQuiz = await this.quizService.create({
      ...createQuizDto, Company: {
        connect: { id: company.id }
      }
    })

    return defaultQuiz
  }

  @Get(':id')
  async getQuiz(@Param('id') id: string) {
    const singleQuiz = await this.quizService.getOne({ id }, {
      include: {
        attempts: true,
      }
    })
    return singleQuiz
  }


}
