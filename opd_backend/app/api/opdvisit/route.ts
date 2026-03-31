import { opdvisitService } from "@/app/services/opdvisit.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Patient", "Receptionist"])

        const opdvisit = await opdvisitService.getOpdvisit()
        return success(opdvisit)
    }
    catch (error) {
        return handleError(error)
    }
}

//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Receptionist"])

        const body = await req.json()
        const opdvisit = await opdvisitService.createOpdvisit(body)

        return success(opdvisit, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
