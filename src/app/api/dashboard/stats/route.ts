
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalResources,
      activeResources,
      totalReservations,
      activeReservations,
      cancelledReservations,
    ] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.count({
        where: { isActive: true },
      }),
      prisma.reservation.count(),
      prisma.reservation.count({
        where: { status: "ACTIVE" },
      }),
      prisma.reservation.count({
        where: { status: "CANCELLED" },
      }),
    ]);

    return NextResponse.json(
      {
        totalResources,
        activeResources,
        totalReservations,
        activeReservations,
        cancelledReservations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get dashboard stats failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
