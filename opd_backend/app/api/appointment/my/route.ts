import { appointmentService } from "@/app/services/appointment.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

// patient-my-appointments
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req);
        authorize(user, ["Admin", "Patient"]);

        const appointment = await appointmentService.getAppointmentForPatientUser(Number(user.userId));
        return success(appointment);
    } catch (error) {
        return handleError(error);
    }
}
