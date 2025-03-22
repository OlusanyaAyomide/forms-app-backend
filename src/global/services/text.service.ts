export function cleanAndParseJson(inputString: string) {
  try {
    // Remove unnecessary escape characters and trim whitespace
    const cleanedString = inputString.replace(/\n/g, "").trim();
    const jsonObject = JSON.parse(cleanedString);

    return jsonObject;
  } catch (error) {
    return null;
  }
}

