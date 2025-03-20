import { Schema, SchemaType } from "@google/generative-ai";

export const quizGeneratorSchema: Schema = {
  type: SchemaType.ARRAY,
  description: "List of structured questions and answers",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question: {
        type: SchemaType.STRING,
        description: "The question text",
        nullable: false
      },
      options: {
        type: SchemaType.ARRAY,
        description: "List of answer choices (capitalized)",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            option: {
              type: SchemaType.STRING,
              description: "An alphabet representing the option",
              nullable: false
            },
            option_content: {
              type: SchemaType.STRING,
              description: "The content of the option",
              nullable: false
            }
          }
        },
        nullable: true
      },
      correct_answer: {
        type: SchemaType.STRING,
        description: "The correct answer, or null if no answer is marked, should be capitalized",
        nullable: true
      },
      question_type: {
        type: SchemaType.STRING,
        format: "enum",
        enum: ["TextArea", "Select"],
        description: "The type of question: 'TextArea' if no options, 'Select' if options are present"
      },
      explanation: {
        type: SchemaType.STRING,
        description: "The explanation to the correct answer for correction purpose",
        nullable: true
      }
    },
    required: ["question", "question_type"]
  }
};
