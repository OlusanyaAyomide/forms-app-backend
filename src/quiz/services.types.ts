export type ScheduledPayload<TPayload> = {
  scheduled_at: Date;
  endpoint: string;
  payload: TPayload;
};

export type QuizScheduleResponse<TPayload> = {
  status: string;
  id: string;
  payload: TPayload;
  message: string;
};
