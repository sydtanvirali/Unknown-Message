import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import TopicModel from "@/models/Topic";
import UserModel from "@/models/User";
import MessageModel from "@/models/Message";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  
  // Check if this is a public request (for send-message page)
  const isPublicRequest = request.headers.get('x-public-request') === 'true';
  
  if (!isPublicRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized User",
        },
        { status: 401 }
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
          { status: 404 }
        );
      }

      const topic = await TopicModel.findById(id);
      if (!topic) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "No topics found",
          },
          { status: 404 }
        );
      }
      // Fixed comparison operator
      if (topic.userId.toString() !== user._id.toString()) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Topic not owned by user",
          },
          { status: 401 }
        );
      }

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "Topic retrieved successfully",
          data: topic,
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic retrieval failed",
        },
        { status: 500 }
      );
    }
  } else {
    // Public request - just return topic data without ownership check
    try {
      const topic = await TopicModel.findById(id);
      if (!topic) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Topic not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "Topic retrieved successfully",
          data: topic,
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic retrieval failed",
        },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Unauthorized User",
      },
      { status: 401 }
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
        { status: 404 }
      );
    }

    const topic = await TopicModel.findById(id);
    if (!topic) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "No topics found",
        },
        { status: 404 }
      );
    }
    // Fixed comparison operator
    if (topic.userId.toString() !== user._id.toString()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic not owned by user",
        },
        { status: 401 }
      );
    }

    await MessageModel.deleteMany({ topicId: topic._id });
    const deletedTopic = await TopicModel.findByIdAndDelete({ _id: topic._id });
    if (!deletedTopic) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Topic deletion failed",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Topic deleted successfully",
        data: deletedTopic,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting topic:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Topic deletion failed",
      },
      { status: 500 }
    );
  }
}