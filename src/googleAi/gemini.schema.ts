import { Schema, SchemaType } from "@google/generative-ai";

export const quizGeneratorSchema: Schema = {
  type: SchemaType.ARRAY,
  description: "Array of structured questions and answers",
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
        description: "Array of answer choices (capitalized)",
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
        type: SchemaType.ARRAY,
        description: "An Array of marked answers,it should multiple strings if there are more than one answer,should be capitalized, or null, if no answer is present",
        items: {
          type: SchemaType.STRING,
          description: "An item of the correct answer",
        },
        nullable: true
      },
      question_type: {
        type: SchemaType.STRING,
        format: "enum",
        enum: ["Text", "Select"],
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

export const quizOptionSchema: Schema = {
  type: SchemaType.ARRAY,
  description: "Array of options A to D",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      option: {
        type: SchemaType.STRING,
        format: "enum",
        enum: ["A", "B", "C", "D"],
        description: "An alphabet representing the option",
        nullable: false
      },
      option_content: {
        type: SchemaType.STRING,
        description: "The content of the option",
        nullable: false
      }
    }
  }
}


export const quizExplanationSchema: Schema = {
  type: SchemaType.OBJECT,
  description: "An object containing the explanation to the question",
  properties: {
    explanation: {
      type: SchemaType.STRING,
      description: "The Explanation to the question",
      nullable: false
    },
  }

}