const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCode(prompt, language) {
  try {
    // MUST use v1 model path
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const systemPrompt = `
You are an expert code generator.
Generate clean, efficient, runnable code in ${language}.
Return ONLY code — no explanations.
`;

    const fullPrompt = `${systemPrompt}\nTask: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    let generatedCode = response.text().trim();

    return generatedCode;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate code using AI service");
  }
}

module.exports = { generateCode };
