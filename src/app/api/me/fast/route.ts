import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { username, displayUsername, email, name, image } = session.user;

  return NextResponse.json({
    username,
    displayUsername,
    email,
    name,
    image,
  });
}
