import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();
  await connectToDB();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });

  return NextResponse.json({ message: "User created", userId: user._id });
}
