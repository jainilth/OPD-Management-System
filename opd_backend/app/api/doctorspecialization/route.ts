import { doctorspecializationService } from "@/app/services/doctorspecialization.service";
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

        const doctorspecialization = await doctorspecializationService.getDoctorspecialization()
        return success(doctorspecialization)
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
        const doctorspecialization = await doctorspecializationService.createDoctorspecialization(body)

        return success(doctorspecialization, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
