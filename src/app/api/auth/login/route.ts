import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const sessionSecret = process.env.SESSION_SECRET;

    if (!adminEmail || !passwordHash || !sessionSecret) {
      console.error("Admin authentication environment variables are missing.");
      return NextResponse.json(
        { error: "Authentication is not configured." },
        { status: 500 },
      );
    }

    const passwordMatches = await bcrypt.compare(password, passwordHash);
    const emailMatches =
      email.toLowerCase() === adminEmail.trim().toLowerCase();

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }
    const secret = new TextEncoder().encode(sessionSecret);

    const token = await new SignJWT({
      role: "admin",
      email: adminEmail,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    const response = NextResponse.json(
      { message: "Login successful." },
      { status: 200 },
    );

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    console.error("Admin login failed:", error);
    return NextResponse.json(
      { error: "Unable to log in. Please try again." },
      { status: 500 },
    );
  }
}
