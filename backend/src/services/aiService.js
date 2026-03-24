const { GoogleGenerativeAI } = require("@google/generative-ai");

// Validate API key at startup
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ WARNING: GEMINI_API_KEY environment variable is not set. Code generation will fail until this is configured.");
}

let genAI = null;

// Initialize genAI safely
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("✅ Gemini API initialized");
  }
} catch (error) {
  console.error("❌ Error initializing Gemini API:", error.message);
}

async function generateCode(prompt, language) {
  try {
    if (!genAI) {
      throw new Error("Gemini API is not initialized. Please check your GEMINI_API_KEY configuration.");
    }

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
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to generate code using AI service: " + error.message);
  }
}

module.exports = { generateCode };
