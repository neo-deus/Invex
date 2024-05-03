import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
//api/users/verifyEmail
connect();

export async function POST(request) {
    try{
        const reqBody = await request.json()
        const {email, password} = reqBody;
        console.log(reqBody);

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        console.log("user exists");
        if (!user.isVerified) {
            return NextResponse.json({ error: "User not verified" }, { status: 403 });
        }
        
        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        console.log(user);

        //generate webtoken for cookies
        //create token data
        const tokenData=({
            id:user._id,
            username: user.username,
            email: user.email

        })

        const token=jwt.sign(tokenData,process.env.TOKEN_SECRET);

        const response=NextResponse.json({
            message:"Login successfully",
            success:true
        })

        response.cookies.set("token",token,{
            httpOnly: true, 
            
        })
        return response;

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
     }
}