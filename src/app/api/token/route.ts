import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const STREAM_SECRET = process.env.STREAM_SECRET!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const serverClient = StreamChat.getInstance(API_KEY, STREAM_SECRET);
    const token = serverClient.createToken(userId);
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
  }
  
}