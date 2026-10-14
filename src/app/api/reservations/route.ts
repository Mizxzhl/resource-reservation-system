import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: View all reservations
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        resource: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Get reservations failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

// POST: Create a reservation
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      resourceId,
      reservedBy,
      purpose,
      startTime: startTimeValue,
      endTime: endTimeValue,
    } = body ?? {};

    // Validate required input
    if (
      !Number.isInteger(resourceId) ||
      resourceId <= 0 ||
      typeof reservedBy !== "string" ||
      !reservedBy.trim() ||
      typeof purpose !== "string" ||
      !purpose.trim() ||
      typeof startTimeValue !== "string" ||
      typeof endTimeValue !== "string"
    ) {
      return NextResponse.json(
        { error: "Please provide all required reservation details" },
        { status: 400 }
      );
    }

    const startTime = new Date(startTimeValue);
    const endTime = new Date(endTimeValue);

    // Validate dates and times
    if (
      !Number.isFinite(startTime.getTime()) ||
      !Number.isFinite(endTime.getTime()) ||
      startTime >= endTime
    ) {
      return NextResponse.json(
        { error: "Start time must be before end time" },
        { status: 400 }
      );
    }

    // Check that the resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Inactive resources cannot be booked
    if (!resource.isActive) {
      return NextResponse.json(
        { error: "This resource is inactive" },
        { status: 409 }
      );
    }

    // Check for overlapping active reservations
    const conflict = await prisma.reservation.findFirst({
      where: {
        resourceId,
        status: "ACTIVE",
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "This resource is already reserved for that time" },
        { status: 409 }
      );
    }

    // Save the reservation
    const reservation = await prisma.reservation.create({
      data: {
        resourceId,
        reservedBy: reservedBy.trim(),
        purpose: purpose.trim(),
        startTime,
        endTime,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    console.error("Create reservation failed:", error);

    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}