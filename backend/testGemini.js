const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("Say hello!");
    console.log("Gemini working:", result.response.text());
  } catch (err) {
    console.error("Gemini Error:", err);
  }
}

test();
