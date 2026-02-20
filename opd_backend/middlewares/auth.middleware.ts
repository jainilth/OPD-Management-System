import { verifyToken } from "@/app/lib/jwt";
import { NextRequest } from "next/server";

export function authenticate(req:NextRequest){
    // console.log(req.cookies.getAll())
    const token=req.cookies.get("accessToken")?.value
    // console.log("TOKEN:",token)
    if(!token) throw new Error("Unauthorized")

    return verifyToken(token)
}