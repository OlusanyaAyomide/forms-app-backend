import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { EnvVariable } from 'src/config/EnvVariables';
import {
  quizExplanationSchema,
  quizGeneratorSchema,
  quizOptionSchema,
} from 'src/googleAi/gemini.schema';
import {
  modelName,
  quizExplanationPrompt,
  quizGeneratorPrompt,
  quizOptionPrompt,
} from 'src/googleAi/gemini.static';

@Injectable()
export class GeminiService {
  private readonly model: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService<EnvVariable>,
    googleGenerativeAI: GoogleGenerativeAI,
  ) {
    this.model = googleGenerativeAI;
  }

  async generateQuizStructure(text: string): Promise<GenerateContentResult> {
    const model = this.model.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: quizGeneratorSchema,
      },
    });

    return await model.generateContent(`${quizGeneratorPrompt} ${text}`);
  }

  async generateQuestionOptions(text: string): Promise<GenerateContentResult> {
    const model = this.model.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: quizOptionSchema,
      },
    });

    return await model.generateContent(`${quizOptionPrompt} ${text}`);
  }

  async generateQuestionExplanation(
    text: string,
  ): Promise<GenerateContentResult> {
    const model = this.model.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: quizExplanationSchema,
      },
    });

    return await model.generateContent(`${quizExplanationPrompt} ${text}`);
  }
}
