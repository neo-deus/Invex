
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromCookie = (request) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        //decodedtoken u get the token data that u created during the login
        return decodedToken.email; 
    } catch (error) {
        throw new Error(error.message);
    }

}