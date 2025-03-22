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

export type QuizQuestion = Question[];