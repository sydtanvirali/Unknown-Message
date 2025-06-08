import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";
import { topicSchema } from "@/schemas/topicSchema";
import TopicModel from "@/models/Topic";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const result = topicSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: result.error.message,
      },
      { status: 400 },
    );
  }

  const { title, description } = result.data;
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

    const topic = await TopicModel.create({
      userId: user._id,
      title,
      description,
    });
    if (!topic) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic creation failed",
        },
        { status: 500 },
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Topic created successfully",
        data: topic,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Topic creation failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  console.log("session", session);
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
    const topics = await UserModel.aggregate([
      {
        $match: {
          email: email,
        },
      },
      {
        $lookup: {
          from: "topics",
          localField: "_id",
          foreignField: "userId",
          as: "topic",
        },
      },
      {
        $unwind: {
          path: "$topic",
        },
      },
      {
        $sort: {
          "topic.createdAt": -1,
        },
      },
      {
        $project: {
          topic: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          topics: {
            $push: "$topic",
          },
        },
      },
    ]);
    if (!topics) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "No topics found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Topics retrieved successfully",
        data: topics,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Topic retrieval failed",
      },
      { status: 500 },
    );
  }
}
