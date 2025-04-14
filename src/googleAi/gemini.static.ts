export const quizGeneratorPrompt = `
    Convert this text into a structured output only
    Capitalize all options, for questions without an answer , correct option is "null"
    for questions without marked answers, answer field is null
    for question without option , question_type is "Text" for questions with options ,question_type field is "Select" 
    correct_answer is an array of strings
`

export const quizOptionPrompt = `
    Create Four multiple options that it in the context of the question,
    Attempt to make one of the options the correct answer,
    The option property is a string of A,B,C,D in capital letter
    The correct answer should be within any of the four options,
    however it is very important you do not highlight which among them is correct
    Ensure to put the correct answer randomly not at a specific alphabet
`

export const quizExplanationPrompt = `
    Using the Question ,Selected Option and The marked correct answer,
    Create an easy to grab explanation for the question ,
    For questions with similar options , go over why each of them is not correct and why the selected answer is correct
    If you strongly think the Selected answer is incorrect  , make a suggestion that is not
`
export const modelName = 'gemini-2.0-flash-lite'

