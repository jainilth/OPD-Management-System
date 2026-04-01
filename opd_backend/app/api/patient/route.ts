import { patientService } from "@/app/services/patient.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Receptionist"])

        const patient = await patientService.getPatient()
        return success(patient)
    }
    catch (error) {
        return handleError(error)
    }
}

//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Receptionist"])

        const body = await req.json()
        const patient = await patientService.createPatient(body)

        return success(patient, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
