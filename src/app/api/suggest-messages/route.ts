import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { topic, description } = await req.json();
  const prompt = `Topic: ${topic} Description: ${description} I will provide a 'Topic' and a 'Description'. Based on these, create a list of three open-ended and engaging answers for message formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction relevant to the provided 'Topic' and 'Description'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

  const { text } = await generateText({
    model: google("gemini-2.5-flash-preview-04-17"),
    prompt: prompt,
  });
  return NextResponse.json({ response: text });
}
