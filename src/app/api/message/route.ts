import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/models/Message";
import TopicModel from "@/models/Topic";
import UserModel from "@/models/User";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const body = await request.json();
  const result = messageSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: result.error.message,
      },
      { status: 400 },
    );
  }
  const { topicId, content } = result.data;
  try {
    const topic = await TopicModel.findById(topicId);
    if (!topic) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "topic not found",
        },
        { status: 404 },
      );
    }
    const user = await UserModel.findById(topic.userId);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }
    if (!user.isAcceptingMessage) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 400 },
      );
    }
    const message = await MessageModel.create({
      topicId,
      content,
    });
    if (!message) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Message not sent",
        },
        { status: 500 },
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Message sent successfully",
        data: message,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
