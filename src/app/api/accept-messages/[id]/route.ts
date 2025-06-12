import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel from "@/models/User";
import TopicModel from "@/models/Topic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Unauthorized User",
      },
      { status: 401 },
    );
  }
  const email = session.user?.email;
  const { id } = await params;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }
    const topic = await TopicModel.findById(id);
    if (!topic) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic not found",
        },
        { status: 404 },
      );
    }
    if (!topic.userId === user._id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic not owned by user",
        },
        { status: 401 },
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Fetch message acceptance status successfully.",
        data: { isAcceptingMessages: topic.isAcceptingMessages },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to get user", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to get message acceptance status.",
      },
      { status: 500 },
    );
  }
}
