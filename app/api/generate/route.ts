import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "Text content is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `You are an expert educational tutor. Analyze the following source study material, lecture notes, or textbook text and transform it into highly structured, clean, and comprehensive study notes in Markdown format.

Your output should include:
- A brief high-level summary.
- Core concepts with clear definitions.
- Detailed bullet points explaining key ideas.
- Actionable takeaways or practice/review questions if appropriate.

Ensure the notes are extremely readable, professional, and well-organized. Do not include any meta-talk or introductory remarks like "Here are your notes:". Start directly with the structured notes.

Source Material:
"""
${text}
"""`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ notes: responseText });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate notes." },
      { status: 500 }
    );
  }
}
