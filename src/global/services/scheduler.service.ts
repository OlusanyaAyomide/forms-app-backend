import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosResponse } from 'axios';

import { EnvVariable } from 'src/config/EnvVariables';
import { QuizScheduleResponse, ScheduledPayload } from 'src/quiz/services.types';




@Injectable()
export class ScheduleService {
  constructor(
    private readonly configService: ConfigService<EnvVariable>,
  ) { }

  async Scheduler<TPayload>(
    schedulePayload: ScheduledPayload<TPayload>):
    Promise<QuizScheduleResponse<TPayload> | null> {

    const baseUrl: string = this.configService.get("LIVE_URL", "");

    try {
      const response = await axios.post<
        ScheduledPayload<TPayload>,
        AxiosResponse<QuizScheduleResponse<TPayload>>
      >(
        `https://scheduler-small-grass-8417.fly.dev/schedule`,
        {
          scheduled_at: schedulePayload.scheduled_at.toISOString(),
          endpoint: `${baseUrl}/${schedulePayload.endpoint}`,
          payload: schedulePayload.payload,
        }
      );

      if (response.status.toString().startsWith("2")) {
        return response.data;
      } else {
        return null;
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      throw new Error(axiosError.message);
    }
  }
}
