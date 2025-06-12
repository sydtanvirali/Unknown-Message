import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import TopicModel from "@/models/Topic";

export async function POST(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Unauthorized User.",
      },
      { status: 401 }
    );
  }
  const email = session.user?.email;

  const body = await request.json();
  const result = acceptMessageSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Invalid request.",
        data: result.error,
      },
      { status: 400 }
    );
  }
  const { acceptMessages, topicId } = result.data;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const topic = await TopicModel.findById(topicId);
    if (!topic) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic not found.",
        },
        { status: 404 }
      );
    }

    if (topic._id === user._id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic not owned by user.",
        },
        { status: 401 }
      );
    }

    const updatedTopic = await TopicModel.findByIdAndUpdate(
      topicId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedTopic) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Failed to update message acceptance status.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        data: { isAcceptingMessage: updatedTopic.isAcceptingMessage },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to update message acceptance status",
      },
      { status: 500 }
    );
  }
}
