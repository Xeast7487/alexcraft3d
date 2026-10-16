import { NextRequest, NextResponse } from "next/server";

const USERS: Record<string, string | undefined> = {
  alex:    process.env.ALEX_PASSWORD,
  vincent: process.env.VINCENT_PASSWORD,
};

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const expected = USERS[username?.toLowerCase()];
  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("ac3d_auth", username.toLowerCase(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
