export const quizGeneratorPrompt = `
    Convert this text into a structured output only
    Capitalize all options, for questions without an answer , correct option is "null"
    for questions without marked answers, answer field is null
    for question without option , question_type is "TextArea" for questions with options ,question_type field is "Select" 
    correct_answer is an array of strings
`

export const modelName = 'gemini-2.0-flash-lite'

