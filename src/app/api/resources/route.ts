
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, description, location } = body ?? {};

    // Validate required fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof location !== "string" ||
      !location.trim()
    ) {
      return NextResponse.json(
        { error: "Name and location are required" },
        { status: 400 }
      );
    }

    // Validate optional description
    if (
      description != null &&
      typeof description !== "string"
    ) {
      return NextResponse.json(
        { error: "Description must be text" },
        { status: 400 }
      );
    }

    // Save resource to PostgreSQL
    const resource = await prisma.resource.create({
      data: {
        name: name.trim(),
        description: description?.trim() ?? null,
        location: location.trim(),
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    console.error("Create resource failed:", error);

    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}




export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error("Get resources failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
