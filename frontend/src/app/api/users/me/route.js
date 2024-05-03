
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request){

    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id: userId}).select("-password"); //-password means that field will not be selected
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}