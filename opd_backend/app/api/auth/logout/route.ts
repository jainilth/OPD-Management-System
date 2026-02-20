import { success } from "@/utils/response";
import { NextResponse } from "next/server";

export async function POST(){
    const response=NextResponse.json({
        success:true,
        message:"Logged out sucessfully"
    })

    response.cookies.set("accessToken","",{
        maxAge:0,
        path:"/"
    })

    return response
}