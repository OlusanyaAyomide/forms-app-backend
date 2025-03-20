import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateContentResult, GoogleGenerativeAI } from '@google/generative-ai';
import { EnvVariable } from 'config/EnvVariables';
import { quizGeneratorSchema } from 'src/googleAi/gemini.schema';
import { modelName, quizGeneratorPrompt } from 'src/googleAi/gemini.static';

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
        responseMimeType: "application/json",
        responseSchema: quizGeneratorSchema,
      },
    });

    return await model.generateContent(`${quizGeneratorPrompt} ${text}`);
  }
}
