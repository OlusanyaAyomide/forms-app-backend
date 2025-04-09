import { Body, Controller, Get, Param, Post, Put, Req } from "@nestjs/common"
import { CreateQuizDto, CreateQuizSectionDto, QuizGeneratorDto } from "./quiz.dto";
import { CompanyMetaData } from "src/auth/auth.types";
import { QuizService } from "./quiz.services";
import { Company } from "src/global/services/decorator.service";
import { GeminiService } from "src/googleAi/gemini.service";
import { cleanAndParseJson } from "src/global/services/text.service";
import { QuizQuestionService } from "./quiz-question.services";
import { CreateQuizQuestionDto, QuizSectionDto } from "./quiz-question.dto";


@Controller("quiz")
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly quizSectionService: QuizQuestionService,
    private readonly geminiService: GeminiService
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

  @Post("generate")
  async generateQuiz(
    @Body() { text }: QuizGeneratorDto
  ) {
    const data = await this.geminiService.generateQuizStructure(text)
    const responseText = data.response.text()
    return { data: cleanAndParseJson(responseText) }
  }

  @Post(":quiz_id/create")
  async createQuiz(
    @Body() quizDataDto: CreateQuizQuestionDto,
    @Param('quiz_id') quizId: string
  ) {
    console.log(quizId)
    return { received: "true" }
  }

  @Put(":id")
  async updateQuiz(
    @Body() createQuizDto: CreateQuizDto,
    @Param('id') id: string
  ) {

    const updatedQuiz = await this.quizService.update(
      id, createQuizDto
    )

    return updatedQuiz
  }

}
