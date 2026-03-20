import { serviceService } from "@/app/services/service.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor"])

        const service = await serviceService.getService()
        return success(service)
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
        const service = await serviceService.createService(body)

        return success(service, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
