import { hospitalService } from "@/app/services/hospital.service";
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

        const hospital = await hospitalService.getHospital()
        return success(hospital)
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
        const hospital = await hospitalService.createHospital(body)

        return success(hospital, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
