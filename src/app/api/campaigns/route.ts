import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import EmailCampaign from "@/models/EmailCampaign";
import UserEmail from "@/models/UserEmail";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [campaigns, total] = await Promise.all([
      EmailCampaign.find(query)
        .populate("gmailConfigId", "name email")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      EmailCampaign.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: campaigns || [],
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      name,
      subject,
      htmlContent,
      textContent,
      recipients,
      gmailConfigId,
      scheduledAt,
    } = body;



    if (!name || !subject || !htmlContent || !gmailConfigId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get recipient count for validation
    let recipientUsers = [];
    if (recipients.includes("all")) {
      recipientUsers = await UserEmail.find({ isActive: true });
    } else if (recipients.some((r: string) => r.startsWith("category:"))) {
      const categories = recipients
        .filter((r: string) => r.startsWith("category:"))
        .map((r: string) => r.replace("category:", ""));
      recipientUsers = await UserEmail.find({
        category: { $in: categories },
        isActive: true,
      });
    } else {
      recipientUsers = await UserEmail.find({
        _id: { $in: recipients },
        isActive: true,
      });
    }

    const campaign = new EmailCampaign({
      name,
      subject,
      htmlContent,
      textContent,
      recipients: recipientUsers.map((u) => u._id),
      gmailConfigId,
      status: "draft",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      sentCount: 0,
      failedCount: 0,
    });

    await campaign.save();

    // Populate the response
    await campaign.populate("gmailConfigId", "name email");

    return NextResponse.json(
      {
        success: true,
        data: campaign,
        recipientCount: recipientUsers.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
