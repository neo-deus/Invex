import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request) {
  try {
    const reqBody = request.json();
    const { email } = await reqBody;

    const user = await User.findOne({ email });
    if (user) {
      NextResponse.json({ error: "User not found" }, { status: 400 });
    } 

    await sendEmail({ email, emailType: "RESET", userId: user._id });
    return NextResponse.json({
      mesaaage: "User found",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
