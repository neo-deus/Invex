import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
//api/users/verifyEmail
connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { token, emailType, newPassword } = reqBody;
    console.log(token);
    console.log(emailType);
    console.log(newPassword);
    if (emailType === "VERIFY") {
      const user = await User.findOne({
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() },
      });
      if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
      }
      user.isVerified = true;
      user.verifyToken = undefined;
      user.verifyTokenExpiry = undefined;
      await user.save();

      return NextResponse.json({
        message: "Email verified successfully",
        success: true,
      });
    } else if (emailType === "RESET") {
      // Handle password reset logic
      const user = await User.findOne({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      });
      if (!user) {
        return NextResponse.json({ error: "User not Found" }, { status: 400 });
      }
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(newPassword, salt);

      user.password =hashPassword;
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      await user.save();
      
      return NextResponse.json({
        message: "Password reset link processed",
        success: true,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
