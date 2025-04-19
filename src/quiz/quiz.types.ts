import { quiz_status } from "@prisma/client";

type QuestionOption = {
  option: string;
  option_content: string;
};

type Question = {
  question: string;
  question_type: "Select" | "TextArea";
  correct_answer: string[];
  explanation?: string;
  options?: QuestionOption[];
};

export type QuizSchedulePayload = {
  status: quiz_status
  quiz_id: string
  scheduled_at: string
}

export type CheckEligibilityArgs = {
  ipAddress: string,
  fingerPrint: string,
  quizId: string
}

export type QuizQuestion = Question[];