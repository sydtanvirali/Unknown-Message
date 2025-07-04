import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import TopicModel from "@/models/Topic";
import UserModel from "@/models/User";

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
    // Fixed comparison operator
    if (topic.userId.toString() !== user._id.toString()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic not owned by user",
        },
        { status: 401 },
      );
    }

    const messages = await TopicModel.aggregate([
      {
        $match: {
          _id: topic._id,
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "topicId",
          as: "message",
        },
      },
      {
        $unwind: {
          path: "$message",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "message.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: {
              $cond: [
                { $ifNull: ["$message", false] },
                "$message",
                "$$REMOVE"
              ]
            }
          },
        },
      },
      {
        $project: {
          _id: 0,
          messages: 1,
        },
      },
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Messages fetched successfully",
        data: messages.length > 0 ? messages : [{ messages: [] }],
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 },
    );
  }
}