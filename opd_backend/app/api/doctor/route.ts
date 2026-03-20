import { doctorService } from "@/app/services/doctor.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Patient"])

        const doctor = await doctorService.getDoctor()
        return success(doctor)
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
        const doctor = await doctorService.createDoctor(body)

        return success(doctor, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
