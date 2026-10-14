import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Check whether a resource is available for a time range
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the resource ID from the URL
    const { id } = await params;
    const resourceId = Number(id);

    // Reject invalid resource IDs
    if (!Number.isInteger(resourceId) || resourceId <= 0) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 }
      );
    }

    // Read the requested start and end times from query parameters
    const { searchParams } = new URL(request.url);
    const startValue = searchParams.get("startTime");
    const endValue = searchParams.get("endTime");

    // Both times are required
    if (!startValue || !endValue) {
      return NextResponse.json(
        { error: "startTime and endTime are required" },
        { status: 400 }
      );
    }

    const startTime = new Date(startValue);
    const endTime = new Date(endValue);

    // Check that the dates are valid and the start precedes the end
    if (
      !Number.isFinite(startTime.getTime()) ||
      !Number.isFinite(endTime.getTime()) ||
      startTime >= endTime
    ) {
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 }
      );
    }

    // Find the resource in the database
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    // Return 404 if the resource does not exist
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Inactive resources cannot be booked
    if (!resource.isActive) {
      return NextResponse.json(
        { error: "Resource is inactive", available: false },
        { status: 409 }
      );
    }

    // Find an active reservation that overlaps the requested time
    const conflict = await prisma.reservation.findFirst({
      where: {
        resourceId,
        status: "ACTIVE",
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    // Report whether the requested time is available
    return NextResponse.json(
      {
        resourceId,
        available: !conflict,
        message: conflict
          ? "Resource is already reserved for this time"
          : "Resource is available",
      },
      { status: 200 }
    );
  } catch (error) {
    // Log unexpected errors and return a server error
    console.error("Check availability failed:", error);

    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}