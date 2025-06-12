import { ApiResponse } from "@/types/ApiResponse";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { topic, description } = await req.json();
  console.log("Received topic:", topic);
  // const prompt = `Topic: ${topic} Description: ${description} I will provide a 'Topic' and a 'Description'. Based on these, create a list of three open-ended and engaging answers below 300 charecters for message formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction relevant to the provided 'Topic' and 'Description'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;
  //   const prompt = `Topic: ${topic} Description: ${description}
  // Help the user craft a meaningful and engaging message based on the above Topic and Description.
  // Generate three open-ended and friendly messages (such as a personal opinion, helpful suggestion, or thoughtful question) under 300 characters each.
  // These messages should spark positive conversation, be inclusive and respectful, and be suitable for an anonymous social platform like Qooh.me.
  // Avoid personal, controversial, or sensitive topics.
  // Format all three messages in a single string, separated by '||'.
  // Make sure they are clear, curiosity-driven, and encourage others to respond or reflect.`;
  const prompt = `Topic: ${topic} Description: ${description} Generate three friendly and engaging message suggestions under 300 characters each that a user can pick from and send as their feedback, opinion, suggestions, experiences. 
The messages should be relevant to the topic and description, spark interest, and encourage positive discussion. 
Avoid personal, negative, or sensitive content. 
Format the suggestions as a single string, with each message separated by '||'.`;

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash-preview-04-17"),
      prompt: prompt,
    });
    if (!text) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No text generated.",
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Text generated successfully.",
      data: text.split("||").map((item) => item.trim()),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: "An error occurred while generating text.",
    });
  }
}
