import { userService } from "@/app/services/user.service"
import { handleError } from "@/middlewares/error.middleware"
import { success } from "@/utils/response"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const user = await userService.createUser(body)

        return success(user, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
