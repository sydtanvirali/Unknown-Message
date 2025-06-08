import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

export async function POST(request: NextRequest) {
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
  const body = await request.json();
  const result = acceptMessageSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: result.error.message,
      },
      { status: 400 },
    );
  }
  const acceptMessage = result.data.acceptMessages;
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { isAcceptingMessage: acceptMessage },
      { new: true },
    );
    if (!updatedUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Message Acceptance updated successfully",
        data: { isAcceptingMessage: updatedUser.isAcceptingMessage },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to update status to message acceptance", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to update user status to message acceptance",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
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
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Fetch user status to message acceptance",
        data: { isAcceptingMessage: user.isAcceptingMessage },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to get user", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to get user",
      },
      { status: 500 },
    );
  }
}
