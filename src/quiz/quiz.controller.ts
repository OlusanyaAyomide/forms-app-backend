import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CreateQuizDto,
  CreateQuizSectionDto,
  QuizGeneratorDto,
  QuizStatusPayloadDto,
  QuizStatusSchedulerDto,
  ResolveFlagDto,
  UpdateQuizDto,
} from './quiz.dto';
import { PayloadMetaData } from 'src/auth/auth.types';
import { QuizService } from './quiz.services';
import {
  Company,
  Public,
  Role,
  RoleOnly,
} from 'src/global/services/decorator.service';
import { GeminiService } from 'src/googleAi/gemini.service';
import { cleanAndParseJson } from 'src/global/services/text.service';
import { QuizQuestionService } from './quiz-question.services';
import {
  CreateUpdateQuizQuestionDto,
  QuestionOptionGenerateDto,
} from './quiz-question.dto';
import { ScheduleService } from 'src/global/services/scheduler.service';
import { QuizSchedulePayload } from './quiz.types';
import { areDatesEqual } from 'src/global/services/date.service';
import { Prisma } from '@prisma/client';
import { ResponseService } from 'src/response/response.service';

@Controller('quiz')
@RoleOnly(Role.Company)
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly responseService: ResponseService,
    private readonly quizSectionService: QuizQuestionService,
    private readonly geminiService: GeminiService,
    private readonly scheduleService: ScheduleService,
  ) { }

  @Post()
  async CreateQuizDto(
    @Body() createQuizDto: CreateQuizDto,
    @Company() company: PayloadMetaData,
  ) {
    const quiz = await this.quizService.create({
      ...createQuizDto,
      Company: {
        connect: { id: company.id },
      },
    });

    return quiz;
  }

  @Get(':id')
  async getQuiz(@Param('id') id: string) {
    const singleQuiz = await this.quizService.getOne(
      { id },
      {
        include: {
          sections: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
            },
          },
          attempts: true,
        },
      },
    );
    return singleQuiz;
  }

  @Post(':quiz_id/section')
  async createSection(
    @Body() createSectionDto: CreateQuizSectionDto,
    @Param('quiz_id') quizId: string,
  ) {
    const section = await this.quizService.createQuizSection({
      ...createSectionDto,
      Quiz: {
        connect: { id: quizId },
      },
    });
    return section;
  }

  @Post('generate')
  async generateQuiz(@Body() { text }: QuizGeneratorDto) {
    const data = await this.geminiService.generateQuizStructure(text);
    const responseText = data.response.text();
    return { data: cleanAndParseJson(responseText) };
  }

  @Post(':quiz_id/create')
  async createUpdateQuiz(
    @Body() quizDataDto: CreateUpdateQuizQuestionDto,
    @Param('quiz_id') quizId: string,
  ) {
    const generatedQuiz =
      await this.quizSectionService.createUpdateQuizQuestion(
        quizDataDto,
        quizId,
      );
    return generatedQuiz;
  }

  @Put(':quiz_id')
  async updateQuiz(
    @Body() updateQuizDto: UpdateQuizDto,
    @Param('quiz_id') quizId: string,
  ) {
    const currentDate = new Date();

    const extraFilter: Prisma.QuizUpdateInput = {};

    if (updateQuizDto.status) {
      if (updateQuizDto.status === 'Opened') {
        extraFilter['opened_at'] = currentDate;
        extraFilter['closed_at'] = null;
      } else if (updateQuizDto.status === 'Closed') {
        extraFilter['closed_at'] = currentDate;
        extraFilter['opened_at'] = null;
        //auto submit all quiz attempts
        await this.responseService.closeAllAttempt({ quizId });
      }
    }

    const updatedQuiz = await this.quizService.update(quizId, {
      ...updateQuizDto,
      ...extraFilter,
    });

    return updatedQuiz;
  }

  @Post('options/generate')
  async generateQuestionOptions(
    @Body() generateOptionDto: QuestionOptionGenerateDto,
  ) {
    const data = await this.geminiService.generateQuestionOptions(
      generateOptionDto.question,
    );
    const responseText = data.response.text();
    return { data: cleanAndParseJson(responseText) };
  }

  @Post('question/:question_id/explanation/generate')
  async generateQuestionExplanation(
    @Param('question_id') questionId: string
  ) {
    const question = await this.quizSectionService.getOneQuestion({
      id: questionId,
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    const stringifiedQuestion = JSON.stringify(question);

    const data =
      await this.geminiService.generateQuestionExplanation(stringifiedQuestion);
    const responseText = data.response.text();
    return { data: cleanAndParseJson(responseText) };
  }

  @Post('status/:quiz_id/schedule')
  async scheduleQuizStatus(
    @Body() schedulePayload: QuizStatusSchedulerDto,
    @Param('quiz_id') quizId: string,
  ) {
    const quizStatus = schedulePayload.status;

    const quiz = await this.quizService.getOne({ id: quizId });

    if (!quiz) {
      throw new NotFoundException('Quiz ID is invalid');
    }

    if (quiz.status === quizStatus) {
      throw new UnprocessableEntityException(`Quiz already ${quizStatus}`);
    }

    await this.quizService.update(quizId, {
      opened_at:
        quizStatus === 'Opened' ? schedulePayload.scheduled_at : undefined,
      closed_at:
        quizStatus === 'Closed' ? schedulePayload.scheduled_at : undefined,
    });

    const response = await this.scheduleService.Scheduler<QuizSchedulePayload>({
      endpoint: `quiz/status/${quizId}/resolve`,
      scheduled_at: schedulePayload.scheduled_at,
      payload: {
        status: quizStatus,
        quiz_id: quizId,
        scheduled_at: schedulePayload.scheduled_at.toISOString(),
      },
    });

    if (!response) {
      throw new UnprocessableEntityException('Unable to schedule status');
    }
    return response;
  }

  //internal
  @Public()
  @Post('status/:quiz_id/resolve')
  async UpdateScheduleQuizStatus(
    @Body() responsePayload: QuizStatusPayloadDto,
    @Param('quiz_id') quizId: string,
  ) {
    const quiz = await this.quizService.getOne({ id: quizId });

    if (!quiz) {
      return null;
    }

    const quizDate =
      responsePayload.status === 'Opened' ? quiz.opened_at : quiz.closed_at;

    const isScheduledStillValid = areDatesEqual(
      responsePayload.scheduled_at,
      quizDate,
    );

    if (!isScheduledStillValid) {
      return null;
    }

    if (responsePayload.status === 'Closed') {
      this.responseService.closeAllAttempt({ quizId });
    }

    await this.quizService.update(quizId, {
      status: responsePayload.status,
    });
    return { message: 'Updated Success' };
  }

  @Get(':quiz_id/attempt/overview')
  async GetQuizAttemptOverview(
    @Param('quiz_id') quizId: string
  ) {
    const quizData = await this.quizService.attemptOverView({ quizId });
    return quizData;
  }

  @Post("question/resolve-flag")
  async ResolveFlag(
    @Body() resolveFlagDto: ResolveFlagDto
  ) {

    await this.quizService.resolveAllQuestionFlag({ questionId: resolveFlagDto.questionId })

    return { message: "Question Flag resolved" }
  }
}
