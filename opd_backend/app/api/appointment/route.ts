import { appointmentService } from "@/app/services/appointment.service";
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

        const appointment = await appointmentService.getAppointment()
        return success(appointment)
    }
    catch (error) {
        return handleError(error)
    }
}

//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor"])

        const body = await req.json()
        const appointment = await appointmentService.createAppointment(body)

        return success(appointment, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
