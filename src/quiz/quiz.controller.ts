import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common"
import { CreateQuizDto, CreateQuizSectionDto } from "./quiz.dto";
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
    const quiz = await this.quizService.create({
      ...createQuizDto, Company: {
        connect: { id: company.id }
      }
    })

    return quiz
  }

  @Get(':id')
  async getQuiz(@Param('id') id: string) {
    const singleQuiz = await this.quizService.getOne({ id }, {
      include: {
        sections: true,
        attempts: true,
      }
    })
    return singleQuiz
  }

  @Post("section")
  async createSection(
    @Body() { quiz_id, ...createSectionDto }: CreateQuizSectionDto
  ) {

    const section = await this.quizService.createQuizSection({
      ...createSectionDto, Quiz: {
        connect: { id: quiz_id }
      }
    })

    return section
  }
}
