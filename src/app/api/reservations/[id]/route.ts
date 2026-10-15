import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// DELETE: Cancel a reservation without deleting its history
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) {
    return unauthorized;
  }
  try {
    const { id } = await params;
    const reservationId = Number(id);

    if (!Number.isInteger(reservationId) || reservationId <= 0) {
      return NextResponse.json(
        { error: "Invalid reservation ID" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (reservation.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Reservation is already cancelled" },
        { status: 409 }
      );
    }

    const cancelledReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(cancelledReservation, { status: 200 });
  } catch (error) {
    console.error("Cancel reservation failed:", error);

    return NextResponse.json(
      { error: "Failed to cancel reservation" },
      { status: 500 }
    );
  }
}