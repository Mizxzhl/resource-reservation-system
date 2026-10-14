
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = Number(id);

    // Validate resource ID
    if (!Number.isInteger(resourceId) || resourceId <= 0) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, location } = body ?? {};

    // Validate input
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof location !== "string" ||
      !location.trim() ||
      (description != null && typeof description !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid resource details" },
        { status: 400 }
      );
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Update resource
    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        name: name.trim(),
        description: description?.trim() ?? null,
        location: location.trim(),
      },
    });

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    console.error("Update resource failed:", error);

    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = Number(id);

    if (!Number.isInteger(resourceId) || resourceId <= 0) {
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 }
      );
    }

    const existingResource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: { isActive: false },
    });

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.error("Delete resource failed:", error);

    return NextResponse.json(
      { error: "Failed to deactivate resource" },
      { status: 500 }
    );
  }
}
