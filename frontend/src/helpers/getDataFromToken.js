
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        console.log(token);
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        //decodedtoken u get the token data that u created during the login
        return decodedToken.id; 
    } catch (error) {
        throw new Error(error.message);
    }

}
