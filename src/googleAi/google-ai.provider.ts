import { Provider } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

export const GoogleAIProvider: Provider = {
  provide: GoogleGenerativeAI,
  useFactory: (configService: ConfigService) => {
    return new GoogleGenerativeAI(configService.get<string>('GEMINI_API_KEY', ''));
  },
  inject: [ConfigService],
};
