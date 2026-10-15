
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function getAdminSession() {
  const token = (await cookies()).get("admin_session")?.value;
  const secret = process.env.SESSION_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] }
    );

    if (
      payload.role !== "admin" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return { email: payload.email, role: "admin" as const };
  } catch {
    return null;
  }
}




// Use this in API routes that require an admin session.
export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  return null;
}
