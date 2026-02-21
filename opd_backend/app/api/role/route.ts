import { roleService } from "@/app/services/role.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin"])

        const role = await roleService.getRole()
        return success(role)
    }
    catch (error) {
        return handleError(error)
    }
}

//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin"])

        const body = await req.json()
        const role = await roleService.createRole(body)

        return success(role, 201)
    }
    catch (error) {
        return handleError(error)
    }
}